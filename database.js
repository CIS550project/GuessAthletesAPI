var exports = module.exports = {};
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

exports.query = function(sql, values, callback) {
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      callback(err, null);
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(sql, values, function (err, rows) {
      if (err) {
        console.error('error querying: ' + err.stack);
        callback(err, null);
        return;
      }

      callback(null, rows)
      connection.release();
    });
  });
};
