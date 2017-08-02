const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');

let id = "5981d45ced02332951f5df10";

Todo.find({
  _id: new ObjectID(id)
}).then((todos) => {
  console.log('Todos: ', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo: ', todo);
});
