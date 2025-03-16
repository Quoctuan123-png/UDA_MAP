require('dotenv').config(); // Load biến môi trường từ .env
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433, // Nếu không có PORT, dùng 1433 mặc định
    options: { encrypt: false, trustServerCertificate: true }
};

// Tạo pool kết nối
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("✅ Database connected!");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });

module.exports = { sql, poolPromise };
