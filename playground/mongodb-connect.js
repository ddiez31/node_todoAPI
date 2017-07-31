// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

// let user = {
//   name: "bob2",
//   age: '34'
// };
//
// let {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoAPI', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   name: 'first thing to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert Todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  db.collection('Users').insertOne({
    name: 'Bob',
    age: 34,
    location: 'StGo'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert User', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  db.close();
})
