var exports = module.exports = {};
var config = require('./config');
var mysql = require('mysql');
var pool = mysql.createPool(config.mysql);

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
