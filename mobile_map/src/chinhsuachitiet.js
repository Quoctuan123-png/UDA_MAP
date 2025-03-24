import React, { useEffect, useState } from "react";
import { customroom, getHouseDetail } from "../src/services/api";

const Chinhsuachitiet = ({ onFix }) => {
  const [formData, setFormData] = useState({});
  const [tab, setTab] = useState("thongtintro");

  useEffect(() => {
    if (!onFix) return;

    const getRoom = async () => {
      try {
        const response = await getHouseDetail(onFix);
        console.log("Dữ liệu API:", response.data.TienNghis);

        setFormData(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    getRoom();
  }, [onFix]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log("Gửi dữ liệu cập nhật:", formData);
      await customroom(onFix, formData);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div>
      <h2>Chỉnh sửa chi tiết</h2>
      {onFix ? (
        <>
          <div>
            <button onClick={() => setTab("thongtintro")}>Thông tin trọ</button>
            <button onClick={() => setTab("chutro")}>Chủ trọ</button>
            <button onClick={() => setTab("tiennghi")}>Tiện nghi</button>
            <button onClick={() => setTab("thongtinthem")}>Thông tin thêm</button>
          </div>

          <div>
            {tab === "thongtintro" && (
              <div>
                <label>Tên nhà trọ: </label>
                <input name="tenNhaTro" value={formData.tenNhaTro || ""} onChange={handleChange} /><br />
                <label>Địa chỉ: </label>
                <input name="diaChi" value={formData.diaChi || ""} onChange={handleChange} /><br />
                <label>Giá từ: </label>
                <input name="giaMin" value={formData.giaMin || ""} onChange={handleChange} /><br />
                <label>Giá đến: </label>
                <input name="giaMax" value={formData.giaMax || ""} onChange={handleChange} /><br />
                <label>Số phòng: </label>
                <input name="soPhong" value={formData.soPhong || ""} onChange={handleChange} /><br />
              </div>
            )}
            {tab === "chutro" && (
              <div>
                <label>Chủ trọ: </label>
                <input name="tenChuNha" value={formData.tenChuNha || ""} onChange={handleChange} /><br />
                <label>Số điện thoại: </label>
                <input name="sdt" value={formData.sdt || ""} onChange={handleChange} /><br />
              </div>
            )}
            {tab === "tiennghi" && (
              <div>
                {formData.TienNghis && formData.TienNghis.length > 0 && (
                  formData.TienNghis.map((item) => (
                    <div key={item.id} className="item">
                      <input type="checkbox" value={item.id} />
                      <p>{item.tenTienNghi}</p>
                      {/* Hiển thị số lượng tiện nghi */}
                      {formData.TienNghis.length}
                    </div>
                  ))
                )}
              </div>
            )}
            {tab === "thongtinthem" && (
              <div>
                <label>Thông tin thêm:</label>
                <input name="thongTinThem" value={formData.thongTinThem || ""} onChange={handleChange} />
              </div>
            )}
            <button onClick={handleSubmit}>Cập nhật</button>
          </div>
        </>
      ) : (
        <p>Chưa chọn nhà trọ nào</p>
      )}
    </div>
  );
};

export default Chinhsuachitiet;
