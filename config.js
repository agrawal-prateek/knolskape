let mysql      = require('mysql');
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'secretpassword',
    database : 'knolskape'
});

connection.connect();

module.exports = connection;