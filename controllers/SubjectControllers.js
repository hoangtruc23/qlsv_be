const db = require('../config/db');

exports.getAllSubjects = async (req, res) => {
    const sql = `
        SELECT 
            s.id AS subject_id,
            s.subject_name,
            s.credit,
            s.teacher_id,
            u.full_name AS teacher_name
        FROM 
            subjects s
        LEFT JOIN 
            user u ON s.teacher_id = u.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.postNewSubject = async (req, res) => {
    const { subject_name, credit } = req.body;

    const query = 'INSERT INTO subjects (subject_name, credit) VALUES (?, ?)';

    db.query(query, [subject_name, credit], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, message: 'Thêm môn học thành công', data: results });
    });
}

exports.assignTeacher = async (req, res) => {
    const { teacher_id, subject_id } = req.body;

    const query = 'UPDATE subjects SET teacher_id = ? WHERE id = ?;';

    db.query(query, [teacher_id, subject_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, message: 'Cập nhật thành công', data: results });
    });
};

//XÓA MÔN HỌC
exports.removeSubject = async (req, res) => {
    const { subject_id } = req.params;

    try {
        const [result] = await db.promise().query(
            'DELETE FROM subjects WHERE id = ?',
            [subject_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy môn học để xóa' });
        }

        res.json({ success: true, message: 'Xóa môn học thành công' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Lỗi khi xóa môn học' });
    }
};

//SỬA MÔN HỌC
exports.updateSubject = async (req, res) => {
    const { subject_id, subject_name, credit } = req.body;

    try {
        const [result] = await db.promise().query(
            'UPDATE subjects SET subject_name = ?, credit = ? WHERE id = ?',
            [subject_name, credit, subject_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy môn học để cập nhật' });
        }

        res.json({ success: true, message: 'Cập nhật môn học thành công' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Lỗi khi cập nhật môn học' });
    }
};