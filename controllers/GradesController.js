const db = require('../config/db');
exports.updateGrade = async (req, res) => {
    const {
        student_class_id,
        process_score,
        midterm_score,
        final_score,
        updated_by
    } = req.body;

    try {
        // Lấy điểm hiện tại (nếu có)
        const [rows] = await db.promise().query(
            `SELECT process_score, midterm_score, final_score FROM grades WHERE student_class_id = ?`,
            [student_class_id]
        );

        let existing = rows[0] || {};

        // Dùng điểm mới nếu có, còn không thì giữ nguyên điểm cũ
        const process = process_score ?? existing.process_score;
        const midterm = midterm_score ?? existing.midterm_score;
        const final = final_score ?? existing.final_score;

        // Nếu đủ 3 điểm thì tính điểm trung bình
        let score_avg = null;
        if ([process, midterm, final].every((v) => v !== null && v !== undefined)) {
            score_avg = ((process * 0.2) + (midterm * 0.3) + (final * 0.5)).toFixed(2);
        }

        // Nếu đã có bản ghi => UPDATE, chưa có => INSERT
        if (rows.length > 0) {
            await db.promise().query(
                `UPDATE grades SET
          process_score = ?, midterm_score = ?, final_score = ?, score_avg = ?, updated_by = ?
         WHERE student_class_id = ?`,
                [process_score ?? existing.process_score, midterm_score ?? existing.midterm_score, final_score ?? existing.final_score, score_avg, updated_by, student_class_id]
            );
        } else {
            await db.promise().query(
                `INSERT INTO grades (student_class_id, process_score, midterm_score, final_score, score_avg, updated_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [student_class_id, process_score ?? null, midterm_score ?? null, final_score ?? null, score_avg, updated_by]
            );
        }

        res.status(200).json({ success: true, message: "Cập nhật điểm thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};


exports.getGradeHistory = async (req, res) => {
    const { student_class_id } = req.params;

    const sql = `
            SELECT 
            g.process_score, 
            g.midterm_score, 
            g.final_score, 
            g.score_avg, 
            g.updated_by,
            g.updated_at,
            u.full_name AS updated_by_name
        FROM 
            grades g
        LEFT JOIN 
            user u ON g.updated_by = u.id
        WHERE 
            g.student_class_id = ?
    `
    try {
        const [rows] = await db.promise().query(
            sql,
            [student_class_id]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};