const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoAPI', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//   db.collection('Todos')
//   .findOneAndUpdate({
//     _id : new ObjectID("597f3796a2e9788e3fef72a9")
//   }, {$set: {
//     completed: false
//   }
// }, {
//   returnOriginal : false
// })
// .then((result) => {
//   console.log(JSON.stringify(result, undefined, 2));
// });

db.collection('Users')
.findOneAndUpdate({
  name: 'Mike'
}, {
  $set: {
    age: 42
  }
}, {
  returnOriginal: false
}).then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
});

});
