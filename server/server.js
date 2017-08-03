const {ObjectID} = require('mongodb');


let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

// Set port to env variable for Heroku, 3000 for dev
const port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    console.log('Unable to fetch todos ', err);
  });
});

app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  })
}, (err) => {
  res.status(400).send(err);
});

app.listen(port, () => {
  console.log(`API up and listening to ${port}`);
});


module.exports = {
  app
};
