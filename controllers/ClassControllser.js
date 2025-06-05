const db = require('../config/db');

exports.getAllClasses = async (req, res) => {
    const sql = `
       SELECT 
            c.id AS class_id,
            c.class_name,
            c.status,
            c.max_students,
            COUNT(sc.student_id) AS current_students,
            c.teacher_id,
            u.full_name AS teacher_name
        FROM 
            classes c
        LEFT JOIN 
            student_classes sc ON c.id = sc.class_id
        LEFT JOIN 
            user u ON c.teacher_id = u.id
        GROUP BY 
            c.id, c.class_name, c.status, c.max_students, c.teacher_id, u.full_name
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


exports.postAssignClasses = async (req, res) => {
    const { subject_id, teacher_id, semester } = req.body;

    const query = 'UPDATE classes SET teacher_id = ? WHERE id = ?;';

    db.query(query, [teacher_id, subject_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ success: true, message: 'Cập nhật thành công', data: results });
    });
};



exports.postNewClasses = async (req, res) => {
    const { subject_id, teacher_id, semester, max_students } = req.body;

    try {
        const [subjectResult] = await db.promise().query(
            'SELECT subject_name FROM subjects WHERE id = ?',
            [subject_id]
        );

        if (subjectResult.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy môn học' });
        }

        const subject_name = subjectResult[0].subject_name;

        const today = new Date();
        // const day = today.getDate().toString().padStart(2, '0');
        // const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const class_name = `${subject_name} - HK${semester} - ${year}`;
        const status = 'active'


        const insertQuery = `
            INSERT INTO classes (class_name, subject_id, semester, year, teacher_id, status, max_students)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [insertResult] = await db.promise().query(insertQuery, [
            class_name,
            subject_id,
            semester,
            year,
            teacher_id,
            status,
            max_students
        ]);

        return res.status(201).json({
            success: true,
            message: 'Thêm lớp học thành công',
            data: insertResult
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// exports.assignStudentToClass = async (req, res) => {
//     const { class_id, student_id } = req.body;

//     await db.promise().query(
//         'INSERT INTO student_classes (class_id, student_id) VALUES (?, ?)',
//         [class_id, student_id]
//     );

//     return res.status(201).json({ success: true, message: 'Gán sinh viên vào lớp thành công' });
// };


exports.assignStudentToClass = async (req, res) => {
    const { class_id, student_id } = req.body;

    try {
        const [rows] = await db.promise().query(
            'SELECT * FROM student_classes WHERE class_id = ? AND student_id = ?',
            [class_id, student_id]
        );

        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Sinh viên đã được gán vào lớp này rồi' });
        }

        await db.promise().query(
            'INSERT INTO student_classes (class_id, student_id) VALUES (?, ?)',
            [class_id, student_id]
        );

        return res.status(201).json({ success: true, message: 'Gán sinh viên vào lớp thành công' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi gán sinh viên vào lớp' });
    }
};



exports.getStudentsInClass = async (req, res) => {
    const { class_id } = req.body;
    const sql = `
            SELECT 
                u.id AS student_id,
                u.full_name,
                u.card_id
            FROM 
                student_classes sc
            JOIN 
                user u ON sc.student_id = u.id
            WHERE 
                sc.class_id = ?;`
    try {
        const [students] = await db.promise().query(sql, [class_id]);
        res.json({ success: true, message: "Thành công", data: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi lấy danh sách sinh viên" });
    }
};