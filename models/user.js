var mongo = require('../mongodb');
var Schema = mongo.Schema;

var Result = new Schema({
  winner: Number,
  loser: Number,
  correct: Boolean
});

var UserSchema = new Schema({
  name: String,
  facebookId: { type: String, unique: true },
  results: { type: [Result], index: true }
});

module.exports = mongo.model('User', UserSchema);
