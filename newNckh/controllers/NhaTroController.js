const express = require("express");
const sequelize = require("../config/db"); // ✅ Đảm bảo bạn có sequelize từ file config

const { Op, Sequelize } = require("sequelize"); // ✅ Thêm Sequelize
const { findNearbyAmenities } = require("./OpenStresstMap")
const { calculateHaversineDistance } = require("./OpenStresstMap")
const HinhAnhNhaTro = require("../models/HinhAnhNhaTro")
const fs = require("fs");
const path = require("path");
const { NhaTro, TienNghi, TienNghiNhaTro, ThongTinThemNhaTro, ThongTinThem } = require("../models");
// tạo phòng trọ mớimới
const createNhaTro = async (req, res) => {
    try {
        // Lấy dữ liệu từ request
        const nhaTroData = {
            tenNhaTro: req.body.tenNhaTro,
            diaChi: req.body.diaChi,
            lat: req.body.lat,
            lon: req.body.lon,
            tenChuNha: req.body.tenChuNha,
            sdt: req.body.sdt,
            soPhong: req.body.soPhong,
            kichThuocMin: req.body.kichThuocMin,
            kichThuocMax: req.body.kichThuocMax,
            giaMin: req.body.giaMin,
            giaMax: req.body.giaMax,
            tienDien: req.body.tienDien,
            tienNuoc: req.body.tienNuoc,
            trangThai: req.body.trangThai,
            ghiChu: req.body.ghiChu,
            nguoiGioiThieu: req.body.nguoiGioiThieu,
            nguoiDuyet: req.body.nguoiDuyet,
        };

        // Tạo nhà trọ mới
        console.log(nhaTroData)

        const newNhaTro = await NhaTro.create(nhaTroData);
        if (!newNhaTro.id) {
            return res.status(500).json({ message: "Không thể tạo nhà trọ!" });
        }
        console.log(nhaTroData)
        const nhaTroId = newNhaTro.id;

        // Thêm tiện nghi phòng trọ
        const tienNghiList = req.body.tienNghi || [];

        if (tienNghiList.length > 0) {
            const tienNghiData = tienNghiList.map(item => ({
                idNhaTro: nhaTroId,
                idTienNghi: typeof item === 'object' ? item.idTienNghi : item
            }));

            await TienNghiNhaTro.bulkCreate(tienNghiData);
        }
        // Thêm thông tin thêm về phòng trọ
        const thongTinThemList = req.body.thongTinThem || [];
        if (thongTinThemList.length > 0) {
            const thongTinThemData = thongTinThemList.map(item => ({
                idNhaTro: nhaTroId,
                idThongTinThem: typeof item === 'object' ? item.idThongTinThem : item
            }));
            await ThongTinThemNhaTro.bulkCreate(thongTinThemData);
        }

        return res.status(201).json({
            message: "Tạo nhà trọ thành công!",
            nhaTro: newNhaTro,
            tienNghi: tienNghiList,
            thongTinThem: thongTinThemList
        });

    } catch (error) {
        res.status(500).json({ error: error.message || "Lỗi không xác định" });
    }
};


// hiển thị toàn bộ phòng trọ
const getAllNhaTro = async (req, res) => {
    try {
        const nhaTroList = await NhaTro.findAll();
        // const noiThatList = await NoiThat.findAll();
        res.status(200).json(nhaTroList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// chức năng tìm kiếm
const findNhaTro = async (req, res) => {
    try {
        let whereCondition = {}; // Điều kiện tìm kiếm

        // ✅ 1. Lọc theo giá thuê
        if (req.body.giaMin || req.body.giaMax) {
            const giaMinUser = req.body.giaMin ? parseInt(req.body.giaMin) : null;
            const giaMaxUser = req.body.giaMax ? parseInt(req.body.giaMax) : null;

            if (giaMinUser !== null && giaMaxUser !== null && giaMinUser > giaMaxUser) {
                return res.status(400).json({ message: "Giá tối thiểu không thể lớn hơn giá tối đa!" });
            }

            whereCondition[Op.and] = whereCondition[Op.and] || [];
            if (giaMinUser !== null) whereCondition[Op.and].push({ giaMax: { [Op.gte]: giaMinUser } });
            if (giaMaxUser !== null) whereCondition[Op.and].push({ giaMin: { [Op.lte]: giaMaxUser } });
        }

        // ✅ 2. Lọc theo kích thước phòng
        if (req.body.kichThuocMin || req.body.kichThuocMax) {
            const kichThuocMinUser = req.body.kichThuocMin ? parseInt(req.body.kichThuocMin) : null;
            const kichThuocMaxUser = req.body.kichThuocMax ? parseInt(req.body.kichThuocMax) : null;

            if (kichThuocMinUser !== null && kichThuocMaxUser !== null && kichThuocMinUser > kichThuocMaxUser) {
                return res.status(400).json({ message: "Kích thước tối thiểu không thể lớn hơn kích thước tối đa!" });
            }

            whereCondition[Op.and] = whereCondition[Op.and] || [];
            if (kichThuocMinUser !== null) whereCondition[Op.and].push({ kichThuocMax: { [Op.gte]: kichThuocMinUser } });
            if (kichThuocMaxUser !== null) whereCondition[Op.and].push({ kichThuocMin: { [Op.lte]: kichThuocMaxUser } });
        }

        // ✅ 3. Lọc theo tiện nghi (nếu có)
        let includeTienNghi = [];
        if (req.body.tienNghi && req.body.tienNghi.length > 0) {
            includeTienNghi = [
                {
                    model: TienNghi,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    where: { id: { [Op.in]: req.body.tienNghi } },
                    required: true // Bắt buộc phải có tiện nghi
                }
            ];
        }

        // ✅ 4. Tìm kiếm nhà trọ từ DB
        let nhaTroList = await NhaTro.findAll({
            where: whereCondition,
            include: includeTienNghi,
        });

        // ✅ 5. Lọc theo khoảng cách (nếu có radius)
        if (req.body.radius) {
            const radius = parseFloat(req.body.radius); // Đơn vị: mét
            nhaTroList = nhaTroList.filter(nhaTro => {
                if (!nhaTro.lat || !nhaTro.lon) return false;
                const distance = calculateHaversineDistance(
                    16.03219245, 108.22099429613442, // Toạ độ ĐH Đông Á
                    parseFloat(nhaTro.lat), parseFloat(nhaTro.lon)
                );

                return distance <= radius; // Chỉ giữ nhà trọ trong bán kính
            });
        }

        return res.status(200).json(nhaTroList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// tìm kiếm tiện ích xung quanh
const findtienich = async (req, res) => {
    try {
        const khanh = await findNearbyAmenities(req.body.lon, req.body.lat)
        res.status(200).json(khanh)
    } catch (error) {
        res.status(500).json({ error: error.message });

    }

}

const upfiles = async (req, res) => {
    try {
        // Kiểm tra nếu không có file nào được tải lên
        if (!req.file && (!req.files || req.files.length === 0)) {
            return res.status(400).json({ error: "Không có file nào được tải lên!" });
        }

        console.log("File nhận được:", req.file || req.files);
        console.log("ID nhà trọ nhận được:", req.body.nhaTroId);

        let uploadedImages = [];

        if (req.file) {
            // Trường hợp upload 1 ảnh
            const image = await HinhAnhNhaTro.create({
                nhaTroId: req.body.nhaTroId, // ID nhà trọ
                hinhAnh: req.file.path // Lưu đường dẫn ảnh
            });
            uploadedImages.push(image);
        } else {
            // Trường hợp upload nhiều ảnh
            uploadedImages = await Promise.all(req.files.map(async (file) => {
                return await HinhAnhNhaTro.create({
                    nhaTroId: req.body.nhaTroId,
                    hinhAnh: file.path
                });
            }));
        }

        res.status(201).json({ message: "Upload thành công!", data: uploadedImages });

        // Xóa file sau khi upload thành công (nếu cần)
        if (req.file) {
            fs.unlinkSync(req.file.path);
        } else {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }

    } catch (error) {
        console.error("Lỗi khi upload file:", error);
        res.status(500).json({ error: error.message });
    }
};
const getRoom = async (req, res) => {
    try {
        const { idNhaTro } = req.params;

        // Tìm thông tin nhà trọ
        const listRoom = await NhaTro.findOne({
            where: { id: idNhaTro },
            include: [
                {
                    model: TienNghi,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    attributes: ["id", "tenTienNghi"]
                },
                {
                    model: ThongTinThem,
                    through: { attributes: [] }, // Ẩn bảng trung gian
                    attributes: ["id", "ThongtinThem"]
                }
            ]
        });

        if (!listRoom) {
            return res.status(404).json({ message: "Không tìm thấy nhà trọ!" });
        }

        return res.status(200).json(listRoom);

    } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


const getImage = async (req, res) => {
    try {
        const { idNhaTro } = req.params; // Lấy idNhaTro từ request

        // Tìm tất cả ảnh có cùng idNhaTro
        const imageRecords = await HinhAnhNhaTro.findAll({
            where: { nhaTroId: idNhaTro },
        });

        if (!imageRecords.length) {
            return res.status(404).json({ error: "Không tìm thấy hình ảnh nào cho nhà trọ này" });
        }

        // Tạo một mảng chứa dữ liệu ảnh dưới dạng binary
        const images = imageRecords.map(img => ({
            id: img.id,
            nhaTroId: img.nhaTroId,
            hinhAnh: img.hinhAnh, // Đây là buffer (binary)
        }));

        res.setHeader("Content-Type", "application/json");
        res.json(images); // Trả về danh sách ảnh dưới dạng binary
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAllTienNghi = async (req, res) => {
    try {
        const TienNGhiList = await TienNghi.findAll();
        // const noiThatList = await NoiThat.findAll();
        res.status(200).json(TienNGhiList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllThongTinThem = async (req, res) => {
    try {
        const ThongTinThemList = await ThongTinThem.findAll();
        // const noiThatList = await NoiThat.findAll();
        res.status(200).json(ThongTinThemList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { getAllTienNghi, getAllThongTinThem, createNhaTro, getAllNhaTro, findNhaTro, findtienich, upfiles, getImage, getRoom };