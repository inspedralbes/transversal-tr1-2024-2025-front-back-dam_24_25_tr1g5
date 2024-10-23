const mysql = require('mysql');
const dataBD = require('./configDB');

const connection = mysql.createConnection({
    host: dataBD.host,
    user: dataBD.user,
    password: dataBD.password,
    database: dataBD.database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
