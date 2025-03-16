const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "sa123";

// Xử lý đăng nhập
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.NVarChar, username)
            .query(`SELECT * FROM users WHERE username = @username`);

        if (!result.recordset.length) {
            return res.status(404).send({ error: 'User not found' });
        }

        const user = result.recordset[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error logging in' });
    }
};

// Đảm bảo xuất hàm loginUser đúng cách
module.exports = { loginUser };
