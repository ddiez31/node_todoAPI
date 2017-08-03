let mongoose = require('mongoose');

//mongoose promises handled by core JS, not by a third-party library
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoAPI');

module.exports = {
  mongoose
};
