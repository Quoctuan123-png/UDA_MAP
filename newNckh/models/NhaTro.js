const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const NhaTro = sequelize.define(
    "NhaTro",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tenNhaTro: { type: DataTypes.STRING },
        diaChi: { type: DataTypes.STRING, allowNull: false },
        lat: { type: DataTypes.STRING },
        lon: { type: DataTypes.STRING },
        tenChuNha: { type: DataTypes.STRING },
        sdt: { type: DataTypes.STRING },
        soPhong: { type: DataTypes.INTEGER },
        kichThuocMin: { type: DataTypes.INTEGER },
        kichThuocMax: { type: DataTypes.INTEGER },
        giaMin: { type: DataTypes.INTEGER },
        giaMax: { type: DataTypes.INTEGER },
        tienDien: { type: DataTypes.INTEGER },
        tienNuoc: { type: DataTypes.INTEGER },
        trangThai: { type: DataTypes.INTEGER },
        ghiChu: { type: DataTypes.STRING },
        nguoiGioiThieu: { type: DataTypes.INTEGER },
        nguoiDuyet: { type: DataTypes.INTEGER },

        // 👉 THÊM 2 TRƯỜNG MỚI:
        conPhong: { type: DataTypes.BOOLEAN, defaultValue: true },
        khoangCachTruong: { type: DataTypes.INTEGER }
    },
    {
        tableName: "NhaTro",
        timestamps: true,
    }
);

module.exports = NhaTro;
