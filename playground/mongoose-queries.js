const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// ===================TODOS====================
let id = "qgfzqrgqrz";

if (!ObjectID.isValid(id)){
  console.log('Invalid ID.');
}

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found.');
  }
  console.log('Todo by id: ', todo);
}).catch((e) => {
  console.log(e);
});

// ===================USERS====================
let user_id = "qgzzqg";

if(!ObjectID.isValid(user_id)){
  return console.log('Invalid user ID.');
}

User.findById(user_id).then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log('User by ID: ', user);
}).catch((e) => {
  console.log(e);
});
