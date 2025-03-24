const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const dotnenv = require('dotenv')
const morgan = require('morgan')
const sequelize = require("./config/db")
const app = express()

const TienIchRouter = require('./routes/TienIchRouter')

const NhaTroRoutes = require('./routes/NhaTroRoutes'); // Import routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({ limi: "50mb" }))
app.use(morgan("common"))
app.use(cors())

app.use('/api', NhaTroRoutes); // Cập nhật base route cho các API của NhaTro
app.use('/api', TienIchRouter); // Cập nhật base route cho các API của NhaTro

app.use('/uploads', express.static('uploads'));

app.listen(8000, () => {
    console.log("server is running!!!")
})