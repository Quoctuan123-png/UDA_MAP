// filepath: /D:/NCKH/backend/routes/register.js

const express = require('express');
const router = express.Router();
const { registerUser, getUsers } = require('../controllers/registerController');

if (!registerUser) {
    throw new Error("registerUser is not defined. Check if registerController.js exports it correctly.");
}

// Route đăng ký
router.post('/',registerUser);

// Route lấy danh sách người dùng
router.get('/users', getUsers);

module.exports = router;