const mysql = require('mysql2');
const dataBD = require('./configDB');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const connection = mysql.createConnection({
    host: dataBD.host,
    user: dataBD.user,
    password: dataBD.password
});

const dataBaseName = dataBD.database;
const sqlFileCrateDB = path.join(__dirname, '..', 'data', 'createDB.sql');
const fileCreateSQL = fs.readFileSync(sqlFileCrateDB, 'utf8');
const sqlFileInsertDB = path.join(__dirname, '..', 'data', 'insertDataDB.sql');
const fileInsertSQL = fs.readFileSync(sqlFileInsertDB, 'utf8');

module.exports = function() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                return reject(err);
            }
            console.log('Connected to MySQL.');

            connection.query(`SHOW DATABASES LIKE '${dataBaseName}'`, (err, result) => {
                if (err) {
                    console.error('Error checking if the database exists:', err);
                    return reject(err);
                }

                if (result.length == 0) {
                    console.log('The database does not exist. Creating the database...');
                    connection.query(`CREATE DATABASE ${dataBaseName}`, (err) => {
                        if (err) {
                            console.error('Error creating the database:', err);
                            return reject(err);
                        }
                        console.log('Database created.');
                        createTables(resolve, reject);
                        console.log('Start inserting data...');
                        insertDataTables(resolve, reject);
                    });
                } else {
                    console.log('The database exists. Restart database...');
                    connection.query(`DROP DATABASE ${dataBaseName}`, (err) => {
                        if (err) {
                            console.error('Error deleting the database:', err);
                            return reject(err);
                        }
                        console.log('Database deleted.');
                        connection.query(`CREATE DATABASE ${dataBaseName}`, (err) => {
                            if (err) {
                                console.error('Error creating the database:', err);
                                return reject(err);
                            }
                            console.log('Database created.');
                            createTables(resolve, reject);
                            console.log('Start inserting data...');
                            insertDataTables(resolve, reject);
                        });
                    });
                }
            });
        });
    });
};

function createTables(resolve, reject) {
    connection.changeUser({ database: dataBaseName }, (err) => {
        if (err) {
            console.error('Error selecting the database:', err);
            return reject(err);
        }
        console.log('Database selected.');

        const sqlStatementsCreate = fileCreateSQL.split(';').map(statement => statement.trim()).filter(statement => statement);

        sqlStatementsCreate.forEach(tableSQL => {
            connection.query(tableSQL, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    return reject(err);
                }
                console.log('Table created.');
                resolve();
            });
        });
    });
}

function insertDataTables (resolve, reject) {

    const insertStatements = fileInsertSQL.split(';').map(statement => statement.trim()).filter(statement => statement);

    connection.changeUser({ database: dataBaseName }, (err) => {
        if (err) {
            console.error('Error selecting the database:', err);
            return reject(err);
        }
        console.log('Database selected.');
        insertStatements.forEach(insertSQL => {
            connection.query(insertSQL, (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return reject(err);
                }
                console.log('Data inserted.');
                resolve();
            });
        });
    });
}