var config = require('./config');
var mongoose = require('mongoose');
var connection = mongoose.connect(config.mongodb);

module.exports = connection;
