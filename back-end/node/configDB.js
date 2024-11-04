const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

const dataBaseName = process.env.DB_NAME;
const sqlFileCrateDB = path.join(__dirname, '.', 'data', 'createDB.sql');
const fileCreateSQL = fs.readFileSync(sqlFileCrateDB, 'utf8');
const sqlFileInsertDB = path.join(__dirname, '.', 'data', 'insertDataDB.sql');
const fileInsertSQL = fs.readFileSync(sqlFileInsertDB, 'utf8');

async function createDB() {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                reject(err);
                return;
            }
            console.log('Connected to MySQL.');

            connection.query(`SHOW DATABASES LIKE '${dataBaseName}'`, (err, result) => {
                if (err) {
                    console.error('Error checking if the database exists:', err);
                    reject(err);
                    return;
                }

                if (result.length == 0) {
                    console.log('The database does not exist. Creating the database...');
                    connection.query(`CREATE DATABASE ${dataBaseName}`, (err) => {
                        if (err) {
                            console.error('Error creating the database:', err);
                            reject(err);
                            return;
                        }
                        console.log('Database created.');
                        createTables().then(() => {
                            console.log('Start inserting data...');
                            insertDataTables().then(resolve).catch(reject);
                        }).catch(reject);
                        connection.end();
                    });
                } else {
                    console.log('The database exists. Restart database...');
                    connection.query(`DROP DATABASE ${dataBaseName}`, (err) => {
                        if (err) {
                            console.error('Error deleting the database:', err);
                            reject(err);
                            return;
                        }
                        console.log('Database deleted.');
                        connection.query(`CREATE DATABASE ${dataBaseName}`, (err) => {
                            if (err) {
                                console.error('Error creating the database:', err);
                                reject(err);
                                return;
                            }
                            console.log('Database created.');
                            createTables().then(() => {
                                console.log('Start inserting data...');
                                insertDataTables().then(resolve).catch(reject);
                            }).catch(reject);
                        });
                    });
                }
            });
        });
    });
}

function createTables() {
    return new Promise((resolve, reject) => {
        connection.changeUser({ database: dataBaseName }, (err) => {
            if (err) {
                console.error('Error selecting the database:', err);
                reject(err);
                return;
            }
            console.log('Database selected.');

            const sqlStatementsCreate = fileCreateSQL.split(';').map(statement => statement.trim()).filter(statement => statement);

            sqlStatementsCreate.forEach((tableSQL, index) => {
                connection.query(tableSQL, (err) => {
                    if (err) {
                        console.error('Error creating table:', err);
                        reject(err);
                        return;
                    }
                    console.log('Table created.');
                    if (index == sqlStatementsCreate.length - 1) {
                        resolve();
                    }
                });
            });
        });
    });
}

function insertDataTables() {
    return new Promise((resolve, reject) => {
        const insertStatements = fileInsertSQL.split(';').map(statement => statement.trim()).filter(statement => statement);

        connection.changeUser({ database: dataBaseName }, (err) => {
            if (err) {
                console.error('Error selecting the database:', err);
                reject(err);
                return;
            }
            console.log('Database selected.');
            insertStatements.forEach((insertSQL, index) => {
                connection.query(insertSQL, (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                        reject(err);
                        return;
                    }
                    console.log('Data inserted.');
                    if (index == insertStatements.length - 1) {
                        resolve();
                    }
                });
            });
        });
    });
}

module.exports = createDB;