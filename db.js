const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '09220322',
    database: `pit_a_pet`
});
db.connect();
module.exports = db;