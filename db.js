const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'dldms',
    password: 'password!',
    database: `pit_a_pet`
});
db.connect();
module.exports = db;