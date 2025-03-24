const express = require("express");
const { updateNhaTro,createNhaTro, getAllNhaTro, findNhaTro, findtienich, upfiles, getImage, getRoom, getAllTienNghi, getAllThongTinThem,danhGiaNhaTro ,getDanhGiaNhaTro,duyet} = require("../controllers/NhaTroController"); const { uploadSingle, uploadMultiple } = require("../middlewares/upload");
const router = express.Router();

router.post("/nha-tro", createNhaTro);
router.post("/find-nha-tro", findNhaTro);
router.post("/upload-multiple", uploadMultiple, upfiles)
router.post("/upload-single", uploadSingle, upfiles)
router.post("/danh-gia/:maNhaTro",danhGiaNhaTro )
router.post("/duyet/:id", duyet);


router.post("/findtienich", findtienich)
router.get("/getimg/:idNhaTro", getImage);
router.get("/getroom/:idNhaTro", getRoom)
// router.post("/test",test)
router.get("/tien-nghi", getAllTienNghi);
router.get("/thong-tin-them", getAllThongTinThem);
router.get("/nha-tro", getAllNhaTro);
router.get("/danh-gia/:maNhaTro", getDanhGiaNhaTro);

router.put("/update-nha-tro/:id", updateNhaTro);

module.exports = router;