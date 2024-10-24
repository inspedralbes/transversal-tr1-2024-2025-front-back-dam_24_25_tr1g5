const mysql = require('mysql2/promise');
const dataBD = require('./configDB');

const connection = mysql.createPool({
    host: dataBD.host,
    user: dataBD.user,
    password: dataBD.password,
    database: dataBD.database,
    waitForConnections: true,
  connectionLimit: 10,  // número máximo de conexiones en el pool
  queueLimit: 0
});

/*connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});*/

module.exports = connection;
