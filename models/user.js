var mongo = require('../mongodb');
var Schema = mongo.Schema;

var Result = new Schema({
  winner: Number,
  loser: Number,
  correct: Boolean
});

var UserSchema = new Schema({
  name: String,
  fbId: String,
  fbToken: String,
  results: [Result]
});

module.exports = mongo.model('User', UserSchema);
