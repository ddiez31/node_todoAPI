let mongoose = require('mongoose');

//mongoose promises handled by core JS, not by a third-party library
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoAPI');

// ================ TODOS ==================
let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// let newTodo = new Todo({
//   text: 'start tests'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved todo', JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log('Unable to save todo', err);
// });

// ================ USERS ==================
let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  }
});

let newUser = new User({
  email: 'mike@bob.com'
});

newUser.save().then((doc) => {
  console.log('Saved user: ', JSON.stringify(newUser, undefined, 2));
}, (err) => {
  console.log('Unable to save user.', err);
});
