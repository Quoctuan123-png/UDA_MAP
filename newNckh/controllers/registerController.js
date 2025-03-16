// filepath: /D:/NCKH/backend/controllers/registerController.js

const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    console.log("🔥 API /api/register được gọi");
    console.log("📥 Dữ liệu nhận được:", req.body);

    const { username, password, email, role } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: "Thiếu thông tin đăng ký" });
    }

    try {
        const pool = await poolPromise;

        // Check if username already exists
        let result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT * FROM users WHERE username = @username');

        if (result.recordset.length > 0) {
            return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
        }

        // Check if email already exists
        result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length > 0) {
            return res.status(400).json({ error: "Email đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Mật khẩu đã mã hóa:", hashedPassword);

        console.log("✅ Kết nối database thành công!");

        result = await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .input('email', sql.NVarChar, email)
            .input('role', sql.NVarChar, role || 'user')
            .query(`INSERT INTO users (username, password, email, role) VALUES (@username, @password, @email, @role)`);

        console.log("✅ Kết quả truy vấn:", result);

        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error("❌ LỖI SQL:", error);
        res.status(500).send({ error: 'Lỗi khi đăng ký người dùng', details: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM users');
        console.log("✅ Kết quả truy vấn người dùng:", result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("❌ LỖI SQL:", error);
        res.status(500).send({ error: 'Lỗi khi truy vấn người dùng', details: error.message });
    }
};

module.exports = { registerUser, getUsers };