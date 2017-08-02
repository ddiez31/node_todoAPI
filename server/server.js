let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

// ================ TODOS ==================

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
//
// let newUser = new User({
//   email: 'jake@bob.com'
// });
//
// newUser.save().then((doc) => {
//   console.log('Saved user: ', JSON.stringify(newUser, undefined, 2));
// }, (err) => {
//   console.log('Unable to save user.', err);
// });
