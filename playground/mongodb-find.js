const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoAPI', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').find().toArray().then((docs) => {
    console.log(`Todos: ${JSON.stringify(docs, undefined, 2)}`);
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

  db.close();
})
