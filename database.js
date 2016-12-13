var config = require('./config');
var mysql = require('mysql');
var pool = mysql.createPool(config.mysql);
handleDisconnect(pool);

function handleDisconnect(client) {
  client.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;

    console.error('> Re-connecting lost MySQL connection: ' + error.stack);

    pool = mysql.createPool(config.mysql);
    handleDisconnect(pool);
    pool.connect();
  });
}

module.exports = pool;
