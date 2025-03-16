const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController'); // Kiểm tra đường dẫn

if (!loginUser) {
    throw new Error("loginUser is not defined. Check if loginController.js exports it correctly.");
}

// Route đăng nhập
router.post('/', loginUser);

module.exports = router;
