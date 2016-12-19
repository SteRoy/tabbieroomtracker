var mysql      = require('mysql');

var mysqlConnection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});

module.exports = mysqlConnection;