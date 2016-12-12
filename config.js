var config = null;

if (process.env.NODE_CONFIG != null) {
  config = JSON.stringify(process.env.NODE_CONFIG);
} else {
  config = require('./config.json');
}

module.exports = config;