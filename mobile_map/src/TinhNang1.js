import React, { useEffect, useState } from "react";
import { fetchLocations, handleDuyetAPI } from "../src/services/api";
import Chinhsuachitiet from "./chinhsuachitiet";

const TinhNang1 = () => {
  const [locations, setLocations] = useState([]); // State lưu dữ liệu nhà trọ
  const [onfix, setOnFix] = useState(null); // ID nhà trọ đang sửa
  const [statusFix, setStatusFix] = useState(false); // Trạng thái sửa
  const selectedLocation = locations.find((location) => location.id === onfix);

  // Lấy dữ liệu nhà trọ từ API khi component mount
  useEffect(() => {
    const getData = async () => {
      const data = await fetchLocations();
      setLocations(data);
    };
    getData();
  }, []);

  // Hàm duyệt hoặc hủy duyệt
  const handleDuyet = async (id) => {
    try {
      const response = await handleDuyetAPI(id);
      console.log("API Response: ", response);

      if (response && response.status === 200) {
        const updatedLocations = await fetchLocations();
        setLocations(updatedLocations);
      } else {
        console.error("Duyệt thất bại hoặc API không trả về dữ liệu hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi duyệt hoặc hủy duyệt nhà trọ:", error);
    }
  };

  // Hàm hiển thị chỉnh sửa
  const handleHienChiTiet = (id) => {
    console.log("Chi tiết nhà trọ có ID:", id);
    setStatusFix(true);
    setOnFix(id);
  };

  // Hàm ẩn chỉnh sửa
  const handleAnChiTiet = () => {
    setStatusFix(false);
    setOnFix(null);
  };

  return (
    <div>
      <h1>Tính Năng 1</h1>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Nhà Trọ</th>
            <th>Địa Chỉ</th>
            <th>Lat</th>
            <th>Lon</th>
            <th>Tên Chủ Nhà</th>
            <th>SĐT</th>
            <th>Số Phòng</th>
            <th>Kích Thước Min</th>
            <th>Kích Thước Max</th>
            <th>Giá Min</th>
            <th>Giá Max</th>
            <th>Tiền Điện</th>
            <th>Tiền Nước</th>
            <th>Ghi Chú</th>
            <th>Người Giới Thiệu</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Người Duyệt</th>
            <th>Còn Phòng</th>
            <th>Khoảng Cách Trường</th>
            <th>Trạng Thái</th>
            <th>Chỉnh Sửa</th>
          </tr>
        </thead>
        <tbody>
          {statusFix && selectedLocation ? (
            // Nếu đang sửa, chỉ hiển thị thông tin của selectedLocation
            <tr>
              <td>{selectedLocation.id}</td>
              <td>{selectedLocation.tenNhaTro}</td>
              <td>{selectedLocation.diaChi}</td>
              <td>{selectedLocation.lat}</td>
              <td>{selectedLocation.lon}</td>
              <td>{selectedLocation.tenChuNha}</td>
              <td>{selectedLocation.sdt}</td>
              <td>{selectedLocation.soPhong}</td>
              <td>{selectedLocation.kichThuocMin}</td>
              <td>{selectedLocation.kichThuocMax}</td>
              <td>{selectedLocation.giaMin}</td>
              <td>{selectedLocation.giaMax}</td>
              <td>{selectedLocation.tienDien}</td>
              <td>{selectedLocation.tienNuoc}</td>
              <td>{selectedLocation.ghiChu}</td>
              <td>{selectedLocation.nguoiGioiThiệu}</td>
              <td>{selectedLocation.createdAt}</td>
              <td>{selectedLocation.updatedAt}</td>
              <td>{selectedLocation.nguoiDuyet}</td>
              <td>{selectedLocation.conPhong}</td>
              <td>{selectedLocation.khoangCachTruong}</td>
              <td>
                <button
                  style={{
                    backgroundColor: selectedLocation.trangThai === 0 ? "#28a745" : "#dc3545",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDuyet(selectedLocation.id)}
                >
                  {selectedLocation.trangThai === 0 ? "Duyệt" : "Hủy duyệt"}
                </button>
              </td>
              <td>
                <button
                  onClick={handleAnChiTiet}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                >
                  Hủy sửa
                </button>
              </td>
            </tr>
          ) : (
            // Nếu không sửa, hiển thị toàn bộ danh sách
            locations.length > 0 ? (
              locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.id}</td>
                  <td>{location.tenNhaTro}</td>
                  <td>{location.diaChi}</td>
                  <td>{location.lat}</td>
                  <td>{location.lon}</td>
                  <td>{location.tenChuNha}</td>
                  <td>{location.sdt}</td>
                  <td>{location.soPhong}</td>
                  <td>{location.kichThuocMin}</td>
                  <td>{location.kichThuocMax}</td>
                  <td>{location.giaMin}</td>
                  <td>{location.giaMax}</td>
                  <td>{location.tienDien}</td>
                  <td>{location.tienNuoc}</td>
                  <td>{location.ghiChu}</td>
                  <td>{location.nguoiGioiThiệu}</td>
                  <td>{location.createdAt}</td>
                  <td>{location.updatedAt}</td>
                  <td>{location.nguoiDuyet}</td>
                  <td>{location.conPhong}</td>
                  <td>{location.khoangCachTruong}</td>
                  <td>
                    <button
                      style={{
                        backgroundColor: location.trangThai === 0 ? "#28a745" : "#dc3545",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDuyet(location.id)}
                    >
                      {location.trangThai === 0 ? "Duyệt" : "Hủy duyệt"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleHienChiTiet(location.id)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    >
                      sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="22" style={{ textAlign: "center" }}>Không có dữ liệu nhà trọ</td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {statusFix && <Chinhsuachitiet onFix={onfix} />}
    </div>
  );
};

export default TinhNang1;
