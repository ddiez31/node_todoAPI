const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoAPI', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log(`Todos: ${JSON.stringify(docs, undefined, 2)}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // });
  //
  // db.collection('Todos').find({
  //   _id: new ObjectID('597f37d2a2e9788e3fef72b9')
  // }).toArray().then((docs) => {
  //   console.log(`Todos: ${JSON.stringify(docs, undefined, 2)}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // });


  // db.collection('Todos').find({
  //   _id: new ObjectID('597f37d2a2e9788e3fef72b9')
  // }).count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // });

  db.collection('Users').find({
    name: 'Mike'
  }).toArray().then((docs) => {
    console.log(`Users: ${JSON.stringify(docs, undefined, 2)}`);
  }, (err) => {
    console.log('Unable to fetch users', err)
  });
  //
  // db.close();
})
