let mongoose = require('mongoose');

//mongoose promises handled by core JS, not by a third-party library
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoAPI');


let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

let newTodo = new Todo({
  text: '    edit package.json    ',
  completed: true
});

newTodo.save().then((doc) => {
  console.log('Saved todo', JSON.stringify(doc, undefined, 2));
}, (err) => {
  console.log('Unable to save todo', err);
});
