const express = require("express");
const { createNhaTro, getAllNhaTro, findNhaTro, findtienich, upfiles, getImage, getRoom, getAllTienNghi, getAllThongTinThem } = require("../controllers/NhaTroController"); const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const router = express.Router();

router.post("/nha-tro", createNhaTro);
router.post("/find-nha-tro", findNhaTro);
router.post("/upload-multiple", uploadMultiple, upfiles)
router.post("/upload-single", uploadSingle, upfiles)

router.post("/findtienich", findtienich)
router.get("/getimg/:idNhaTro", getImage);
router.get("/getroom/:idNhaTro", getRoom)
// router.post("/test",test)
router.get("/tien-nghi", getAllTienNghi);
router.get("/thong-tin-them", getAllThongTinThem);
router.get("/nha-tro", getAllNhaTro);

module.exports = router;