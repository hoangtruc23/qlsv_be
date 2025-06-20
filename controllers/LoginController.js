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

        const generateRandomCode = () => {
            const random = Math.floor(Math.random() * 10000); // 0 - 9999
            return String(random).padStart(4, '0');
        };

        if (role == 3) {
            // Role sinh viên
            let formattedNumber, isUnique = false;
            const prefix = `SVIT${currentYear}`;

            // Lặp cho đến khi tìm được mã số chưa tồn tại
            while (!isUnique) {
                formattedNumber = generateRandomCode();
                finalUsername = `${prefix}${formattedNumber}`; // Gán giá trị cho biến toàn cục

                const [check] = await db.promise().query(
                    `SELECT id FROM user WHERE username = ?`,
                    [finalUsername]
                );

                if (check.length === 0) {
                    isUnique = true;
                }
            }

            card_id = formattedNumber;
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
            `INSERT INTO user (full_name, card_id, username, password, role) VALUES (?,?,?, ?, ?)`,
            [full_name, card_id, finalUsername, hashedPassword, role]
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


exports.changePassword = async (req, res) => {
    const { user_id, old_password, new_password } = req.body;
    // const userId = req.user.id; // Đảm bảo middleware xác thực đã thêm user vào req

    if (!old_password || !new_password) {
        return res.status(400).json({ error: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
    }

    try {
        // 1. Lấy mật khẩu hiện tại từ DB
        const [rows] = await db.promise().query(
            'SELECT password FROM user WHERE id = ?',
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }

        const hashedPassword = rows[0].password;

        // 2. So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(old_password, hashedPassword);

        if (!isMatch) {
            // return res.status(401).json({ error: 'Mật khẩu cũ không chính xác.' });
            return res.json({ success: false, message: 'Mật khẩu cũ không chính xác.' });
        }

        // 3. Mã hóa mật khẩu mới
        const newHashedPassword = await bcrypt.hash(new_password, 10);

        // 4. Cập nhật vào DB
        await db.promise().query(
            'UPDATE user SET password = ? WHERE id = ?',
            [newHashedPassword, user_id]
        );

        return res.json({ success: true, message: 'Đổi mật khẩu thành công.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi khi đổi mật khẩu.' });
    }
};