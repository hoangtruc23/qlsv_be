const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'qlsv_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message);
        console.error(err);
    } else {
        console.log('✅ MySQL connected');
    }
});

module.exports = connection;