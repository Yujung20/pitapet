const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'flora',
    password: 'shin*7883',
    database: `pit_a_pet_example`
});
db.connect();
module.exports = db;