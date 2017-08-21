const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    completed: true,
    completedAt: '1',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text : 'second test todo',
    _creator: userTwoId
  }
];

const users = [
  {
    _id: userOneId,
    email: "bobleblob@bob.com",
    password: "bobleblob",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: "bobleblobaussi@bob.com",
    password: "bobleblobaussi",
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

const populateTodos = (done) => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}
