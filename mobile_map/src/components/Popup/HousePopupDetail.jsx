import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./HousePopupDetail.css"; 
const HousePopupDetail = ({ house }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Yêu cầu của bạn đã được gửi thành công!");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="popup-container">
      <div className="popup-tabs">
        <button onClick={() => handleTabChange("info")} className={`tab-btn ${activeTab === "info" ? "active" : ""}`}>Thông tin</button>
        <button onClick={() => handleTabChange("amenities")} className={`tab-btn ${activeTab === "amenities" ? "active" : ""}`}>Tiện ích</button>
        <button onClick={() => handleTabChange("contact")} className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}>Liên hệ</button>
      </div>

      {/* Tabs content */}
      {activeTab === "info" && (
        <div className="house-info" >
          <p><b>Tên nhà trọ:</b> {house.tenNhaTro}</p>
          <p><b>Địa chỉ:</b> {house.diaChi}</p>
          <p><b>Chủ nhà:</b> {house.tenChuNha}</p>
          <p><b>Số điện thoại:</b> {house.sdt}</p>
          <p><b>Kích thước:</b> {house.kichThuocMin} - {house.kichThuocMax} m²</p>
          <p><b>Số lượng phòng trọ:</b> {house.soPhong}</p>
          <p><b>Giá thuê:</b> {house.giaMin ? house.giaMin.toLocaleString() : "N/A"} - {house.giaMax ? house.giaMax.toLocaleString() : "N/A"} VND/tháng</p>
          <p><b>Giá điện:</b> {house.tienDien.toLocaleString()} VND/kWh</p>
          <p><b>Giá nước:</b> {house.tienNuoc.toLocaleString()} VND/m³</p>
        </div>
      )}
      {activeTab === "amenities" && (
        <>
          <h4>Tiện ích</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {(house.tienIch || []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {activeTab === "contact" && (
        <>
          <h4>Gửi yêu cầu thuê</h4>
          <form onSubmit={handleSubmit} className="popup-form">
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              value={formData.name}
              onChange={handleInputChange}
              required

            />
            <input
              type="tel"
              name="phone"
              placeholder="SĐT"
              value={formData.phone}
              onChange={handleInputChange}
              required

            />
            <textarea
              name="message"
              placeholder="Lời nhắn (tuỳ chọn)"
              value={formData.message}
              onChange={handleInputChange}
              rows={2}

            />
            <button type="submit" >Gửi</button>
          </form>
        </>
      )}
    </div>
  );
};


export default HousePopupDetail;
