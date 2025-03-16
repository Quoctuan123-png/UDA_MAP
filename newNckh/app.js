const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const dotnenv = require('dotenv')
const  morgan = require('morgan')
const sequelize = require("./config/db")
const app = express()

const registerRoutes = require('./routes/register'); // Import route đăng ký
const loginRoutes = require('./routes/login'); // Import route đăng nhập
const userRoutes = require('./routes/users');
const forumRoutes = require('./routes/forum');

const NhaTroRoutes = require('./routes/NhaTroRoutes'); // Import routes

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({limi:"50mb"}))
app.use(morgan("common"))
app.use(cors())

app.use('/api', NhaTroRoutes); // Cập nhật base route cho các API của NhaTro
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(8000, ()=>{
    console.log("server is running!!!")
})