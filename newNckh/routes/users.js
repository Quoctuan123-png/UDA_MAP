const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const { poolPromise, sql } = require('../config/db1'); // Đảm bảo đúng đường dẫn

// 📌 Cấu hình `multer` để lưu ảnh avatar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file thành unique
    }
});

const upload = multer({ storage: storage });

// 📌 API đăng ký người dùng mới (Hỗ trợ upload ảnh)
router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        let { username, password, fullname, phone, address, birthdate, gender } = req.body;
        const avatar = req.file ? `/uploads/${req.file.filename}` : ''; // Lưu đường dẫn ảnh

        // ✅ Kiểm tra các trường bắt buộc
        if (!username || !password || !fullname || !phone || !birthdate) {
            return res.status(400).json({ error: 'Thiếu thông tin đăng ký' });
        }

        // ✅ Chuẩn hóa dữ liệu đầu vào
        username = username.trim().toLowerCase();
        phone = phone.trim();
        address = address ? address.trim() : '';
        gender = gender || 'Other';

        // ✅ Xác định role dựa trên email
        let role = username.endsWith('@donga.edu.vn') ? 'SinhVienUda' : 'user';

        const pool = await poolPromise;

        // ✅ Kiểm tra trùng lặp username
        const existingUser = await pool.request()
            .input('username', sql.NVarChar, username)
            .query('SELECT id FROM users WHERE username = @username');
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }

        // ✅ Kiểm tra trùng lặp số điện thoại
        const existingPhone = await pool.request()
            .input('phone', sql.NVarChar, phone)
            .query('SELECT id FROM users WHERE phone = @phone');
        if (existingPhone.recordset.length > 0) {
            return res.status(400).json({ error: 'Số điện thoại đã tồn tại' });
        }

        // ✅ Băm mật khẩu an toàn
        const hashedPassword = await bcrypt.hash(password, 10);

        const birthdateInput = req.body.birthdate ? req.body.birthdate.trim() : null;

        if (!birthdateInput) {
            return res.status(400).json({ error: 'Ngày sinh không được để trống' });
        }

        console.log("📌 Giá trị birthdate nhận từ Postman:", birthdateInput);

        // ✅ Chấp nhận cả 'YYYY-MM-DD' và 'YYYY/MM/DD'
        const formattedBirthdate = moment(birthdateInput, ['YYYY-MM-DD', 'YYYY/MM/DD'], true);

        if (!formattedBirthdate.isValid()) {
            return res.status(400).json({ error: 'Ngày sinh không hợp lệ. Vui lòng nhập đúng định dạng YYYY-MM-DD.' });
        }

        // ✅ Lưu user vào database
        await pool.request()
            .input('username', sql.NVarChar, username)
            .input('password', sql.NVarChar, hashedPassword)
            .input('fullname', sql.NVarChar, fullname)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .input('birthdate', sql.Date, formattedBirthdate.toDate())
            .input('gender', sql.NVarChar, gender)
            .input('avatar', sql.NVarChar, avatar)
            .input('role', sql.NVarChar, role)
            .query(`INSERT INTO users 
                    (username, password, fullname, phone, address, birthdate, gender, avatar, role, createdAt, updatedAt) 
                    VALUES (@username, @password, @fullname, @phone, @address, @birthdate, @gender, @avatar, @role, GETDATE(), GETDATE())`);

        res.status(201).json({ message: 'Đăng ký thành công', avatar });

    } catch (err) {
        console.error("❌ Error registering user:", err);
        res.status(500).json({ error: 'Lỗi đăng ký người dùng', details: err.message });
    }
});

// 📌 API lấy danh sách người dùng
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT id, username, fullname, phone, address, birthdate, gender, avatar, createdAt, updatedAt, role FROM users');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).send({ error: 'Error fetching users', details: err.message });
    }
});

module.exports = router;
