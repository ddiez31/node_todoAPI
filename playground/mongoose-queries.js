const {ObjectID} = require('mongodb');


const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// ===================TODOS====================
let id = "5981babc45f1304198a1dd3b";

if (!ObjectID.isValid(id)){
  console.log('Invalid ID.');
}

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('User id not found.');
  }
  console.log('Todo by id: ', JSON.stringify(todo, undefined, 2));
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
