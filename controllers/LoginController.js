const db = require('../config/db');
const bcrypt = require("bcrypt");
exports.getAllLogins = async (req, res) => {
    db.query('SELECT * FROM Login', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.checkLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [results] = await db.promise().query('SELECT * FROM user WHERE username = ?', [username]);

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ success: false, message: 'Mật khẩu không đúng' });
        }

        delete user.password;
        return res.json({ success: true, message: 'Đăng nhập thành công', data: user });

    } catch (err) {
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
};




exports.registerUser = async (req, res) => {
    const { full_name, role, username } = req.body;

    if (!full_name || !role) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ họ tên và vai trò." });
    }

    try {
        let finalUsername = username;
        let rawPassword = "";
        const currentYear = new Date().getFullYear().toString().slice(-2); // yy

        if (role == 3) {
            // Role sinh viên
            const [rows] = await db.promise().query(
                `SELECT username FROM user WHERE username LIKE ? ORDER BY username DESC LIMIT 1`,
                [`SVIT${currentYear}%`]
            );

            let nextNumber = 0;
            if (rows.length > 0) {
                const lastUsername = rows[0].username;
                const lastNumber = parseInt(lastUsername.slice(6));
                nextNumber = lastNumber + 1;
            }

            const formattedNumber = String(nextNumber).padStart(4, '0');
            finalUsername = `SVIT${currentYear}${formattedNumber}`;
            rawPassword = 'sinhvien123';
        } else if (role == 2) {
            // Role giảng viên
            if (!username) {
                return res.status(400).json({ error: "Vui lòng nhập tên đăng nhập cho giảng viên." });
            }

            const [exists] = await db.promise().query(`SELECT * FROM user WHERE username = ?`, [username]);
            if (exists.length > 0) {
                return res.status(409).json({ error: "Tên đăng nhập đã tồn tại." });
            }

            rawPassword = 'giaovien123';
        } else {
            return res.status(400).json({ error: "Vai trò không hợp lệ." });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(rawPassword, 10); // độ mạnh 10

        await db.promise().query(
            `INSERT INTO user (full_name, username, password, role) VALUES (?, ?, ?, ?)`,
            [full_name, finalUsername, hashedPassword, role]
        );

        return res.status(201).json({
            success: true,
            message: "Tạo tài khoản thành công",
            user: {
                full_name,
                username: finalUsername,
                role,
                default_password: rawPassword,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Đã xảy ra lỗi khi tạo tài khoản.", err });
    }
};