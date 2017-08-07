const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    completed: true,
    completedAt: '1'
  },
  {
    _id: new ObjectID(),
    text : 'second test todo'
  }
];

const users = [
  {
    _id: new ObjectID(),
    email: "bobleblob@bob.com",
    password: "bobleblob"
  },
  {
    _id: new ObjectID(),
    email: "bobleblobaussi@bob.com",
    password: "bobleblobaussi"
  }
];

const populate = (done) => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => User.remove({})
  .then(() => {
    return User.insertMany(users);
  }))
  .then(() => done());
};

module.exports = {
  todos,
  users,
  populate
}
