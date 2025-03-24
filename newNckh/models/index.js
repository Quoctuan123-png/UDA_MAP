const sequelize = require("../config/db");

const NhaTro = require("./NhaTro");
const TienNghi = require("./TienNghi");
const TienNghiNhaTro = require("./TienNghiNhaTro");
const ThongTinThem = require("./ThongTinThem");
const ThongTinThemNhaTro = require("./ThongTinThemNhaTro");
const DanhGiaNhaTro = require("./DanhGiaNhaTro");
const Users = require("./Users"); // Import User model nếu có

// 🔗 Quan hệ giữa NhaTro & TienNghi (Nhiều - Nhiều)
NhaTro.belongsToMany(TienNghi, {
    through: TienNghiNhaTro,
    foreignKey: "idNhaTro"
});
TienNghi.belongsToMany(NhaTro, {
    through: TienNghiNhaTro,
    foreignKey: "idTienNghi"
});

// 🔗 Quan hệ giữa NhaTro & ThongTinThem (Nhiều - Nhiều)
NhaTro.belongsToMany(ThongTinThem, {
    through: ThongTinThemNhaTro,
    foreignKey: "idNhaTro"
});
ThongTinThem.belongsToMany(NhaTro, {
    through: ThongTinThemNhaTro,
    foreignKey: "idThongTinThem"
});

// 🔗 Quan hệ giữa DanhGiaNhaTro & NhaTro (1 - Nhiều)
NhaTro.hasMany(DanhGiaNhaTro, { foreignKey: "maNhaTro" });
DanhGiaNhaTro.belongsTo(NhaTro, { foreignKey: "maNhaTro" });

// 🔗 Quan hệ giữa DanhGiaNhaTro & User (1 - Nhiều)
Users.hasMany(DanhGiaNhaTro, { foreignKey: "nguoiDanhGia" });
DanhGiaNhaTro.belongsTo(Users, { foreignKey: "nguoiDanhGia" });

// 🚀 Xuất các model để sử dụng
module.exports = {
    sequelize,
    NhaTro,
    TienNghi,
    TienNghiNhaTro,
    ThongTinThem,
    ThongTinThemNhaTro,
    DanhGiaNhaTro,
    Users
};
