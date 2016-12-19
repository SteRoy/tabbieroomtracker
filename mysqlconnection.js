var mysql      = require('mysql');

var mysqlConnection = mysql.createConnection({
  host     : 'gx97kbnhgjzh3efb.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'ayug90pro8vdtmvw',
  password : 'p105fcq1x7vj72ji',
  database : 'g27yd9pew5qmcsuz'
});

module.exports = mysqlConnection;