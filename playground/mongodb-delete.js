const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoAPI', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos')
  // .deleteMany({
  //   text: 'merge'
  // })
  // .then((result) => {
  //   console.log(result);
  // });
  //
  // db.collection('Todos').deleteOne({
  //   text: 'merge'
  // })
  // .then((result) => {
  //   console.log(result)
  // });
  db.collection('Todos').findOneAndDelete({
    completed: true
  }).then((result) => {
    console.log(result);
  });
  // db.close();
});
