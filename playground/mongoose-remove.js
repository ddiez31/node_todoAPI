const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Remove all todos
// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Remove a Todo
Todo.findOneAndRemove({
  text: 'first test todo'
}).then((todo) => {
  console.log(JSON.stringify(todo, undefined, 2));
});

//Also : Todo.findByIdAndRemove()
