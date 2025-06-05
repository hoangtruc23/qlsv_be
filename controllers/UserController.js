const db = require('../config/db');

exports.getAllStudents = async (req, res) => {
    db.query('SELECT * FROM user where role = 3', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};



exports.getAllTeachers = async (req, res) => {
    db.query('SELECT * FROM user where role = 2', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

