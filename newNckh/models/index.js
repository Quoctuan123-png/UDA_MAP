const sequelize = require("../config/db");

const NhaTro = require("./NhaTro");
const TienNghi = require("./TienNghi");
const TienNghiNhaTro = require("./TienNghiNhaTro");
const ThongTinThem = require("./ThongTinThem");
const ThongTinThemNhaTro = require("./ThongTinThemNhaTro");

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

// 🚀 Xuất các model để sử dụng
module.exports = {
    sequelize,
    NhaTro,
    TienNghi,
    TienNghiNhaTro,
    ThongTinThem,
    ThongTinThemNhaTro
};
