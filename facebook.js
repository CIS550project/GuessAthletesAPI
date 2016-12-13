var config = require('./config');
var FB = require('fb');

var fb = new FB.Facebook(config.facebook);

module.exports = fb;