const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 8889,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'qlsv_db'
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