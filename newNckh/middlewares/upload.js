const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Chỉ cho phép upload 1 file với field name là "image"
const uploadSingle = multer({ storage: storage }).single("image");

// Cho phép upload nhiều file với field name là "images"
const uploadMultiple = multer({ storage: storage }).array("images", 5); // Tối đa 5 ảnh

module.exports = { uploadSingle, uploadMultiple };