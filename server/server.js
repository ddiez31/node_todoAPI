require('./config/config');

const {ObjectID} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

// Set port to env variable for Heroku, 3000 for dev
const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());


//===============TODOS====================

app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    console.log('Unable to fetch todos ', err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  // res.send(req.params);
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});
  })
}, (err) => {
  res.status(400).send(err);
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (err) => {
    res.status(400).send();
  })
});


//===============USERS====================
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) =>{
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });

  // User.findOne({email}).then((user) => {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     bcrypt.hash(password, salt, (err, hash) => {
  //       bcrypt.compare("B4c0/\/", hash, function(err, res) {
  //         res.header('x-auth', user.tokens[0].token).send(user);
  //       });
  //     });
  //   });
  // });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});
//===============MISC====================
app.listen(port, () => {
  console.log(`API up and listening to ${port}`);
});


module.exports = {
  app
};
