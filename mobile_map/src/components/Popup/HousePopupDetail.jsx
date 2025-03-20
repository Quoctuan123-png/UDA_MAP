import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./HousePopupDetail.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getHouseDetail, fetchImage, fetchTienIch, fetchTienNghi, fetchThongTinThem } from "../../services/api"; // Import hàm fetchTienIch

const HousePopupDetail = ({ house, onCoordinatesr }) => {
  const [activeTab, setActiveTab] = useState("info");

  const [houseState, sethouseState] = useState(null);
  const [images, setImages] = useState([]);
  const [thongTinThemList, setThongTinThem] = useState([]); // State để lưu trữ thông tin thêm từ nhà trọ
  const [tienNghiList, setTienNghiList] = useState([]);// Lấy danh sách nội thất từ nhà trọ
  const [thongTinThemListAll, setThongTinThemAll] = useState([]); // State để lưu trữ thông tin thêm từ API
  const [tienNghiListAll, setTienNghiListAll] = useState([]);// Lấy danh sách nội thất từ API


  console.log("🏠 Dữ liệu nhà trọ:", house);
  const id = house.id;

  // Lấy danh sách thông tin thêm từ api
  useEffect(() => {
    const fetchThongTinThemList = async () => {
      try {
        const response = await fetchThongTinThem();

        console.log("✅ Dữ liệu tất cả Thông tin thêm:", response);
        setThongTinThemAll(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thông tin thêm:", error);
      }
    };

    fetchThongTinThemList();
  }, []);




  // Lấy danh sách tiện ích xung quanh từ API
  useEffect(() => {
    const fetchTienNghiList = async () => {
      try {
        const response = await fetchTienNghi();
        console.log("✅ Dữ liệu tất cả Tiện nghi:", response);
        setTienNghiListAll(response);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nội thất:", error);
      }
    };

    fetchTienNghiList();
  }, []);



  // // Xử lý lấy dữ liệu hình ảnh
  // useEffect(() => {
  //   const fetchHouseImg = async () => {
  //     try {
  //       const imgUrl = await fetchImage(id);
  //       console.log("Ảnh tải về:", imgUrl); // Kiểm tra dữ liệu ảnh
  //       setImg(imgUrl);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy ảnh:", error);
  //     }
  //   };
  //   fetchHouseImg();
  // }, [id]);

  // //lấy ảnh v2
  // useEffect(() => {
  //   const fetchHouseImg = async () => {
  //     try {
  //       const res = await fetchImage(id);
  //       console.log("Ảnh tải về:", res.images); // Log kiểm tra
  //       setImages(res.images || []);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy ảnh:", error);
  //     }
  //   };
  //   fetchHouseImg();
  // }, [id]);

  //lấy ảnh v3
  useEffect(() => {
    const loadImages = async () => {
      if (activeTab === "image" && id) {
        const imgs = await fetchImage(id);
        setImages(imgs);
        console.log("🖼️ Dữ liệu ảnh:", imgs);
      }
    };
    loadImages();
  }, [activeTab, id]);





  // Xử lý lấy dữ liệu nhà trọ
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const data1 = await getHouseDetail(id);
        sethouseState(data1.data);
        console.log("🏠 Dữ liệu nhà trọ:", data1.data);

        setThongTinThem([...data1.data.ThongTinThems]); // Cập nhật state thông tin thêm của nhà trọ
        console.log("🏠 Dữ liệu thông tin thêm:", data1.data.ThongTinThems);

        setTienNghiList([...data1.data.TienNghis]); // Cập nhật state tiện nghi của nhà trọ

        console.log("🏠 Dữ liệu tiện nghi:", data1.data.TienNghis);



        onCoordinatesr([...data1.data.lat]);
        console.log("🏠 Dữ liệu tọa độ của trọ:", data1.data.lat);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà trọ:", error);
      }
    };

    fetchHouse();
  }, [id]);




  const handleTabChange = (tab) => setActiveTab(tab);



  // Lọc ra danh sách nội thất 
  const tienNghiArray = Array.isArray(tienNghiList) ? tienNghiList : [];
  console.log("Danh sách nội thất:", tienNghiList);

  // Lọc ra danh sách thông tin thêm
  const thongTinThemArray = Array.isArray(thongTinThemList) ? thongTinThemList : [];
  console.log("Danh sách thông tin thêm:", thongTinThemList);

  console.log("✅ Dữ liệu tất cả Ttt:", thongTinThemListAll);
  console.log("✅ Dữ liệu tất cả Tiện nghi:", tienNghiListAll);

  //hàm chia 2 cột
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };


  return (
    <div className="popup-container">
      <div className="popup-tabs">
        <button onClick={() => handleTabChange("info")} className={`tab-btn ${activeTab === "info" ? "active" : ""}`}>Thông tin</button>
        <button onClick={() => handleTabChange("amenities")} className={`tab-btn ${activeTab === "amenities" ? "active" : ""}`}>Tiện nghi</button>
        <button onClick={() => handleTabChange("image")} className={`tab-btn ${activeTab === "image" ? "active" : ""}`}>Hình ảnh</button>
      </div>

      {/* Tabs content */}
      {activeTab === "info" && (
        <div className="table-responsive house-info-table">
          <table className="table table-bordered table-hover table-sm mb-0">
            <tbody>
              <tr>
                <th>Tên nhà trọ</th>
                <td>{house.tenNhaTro}</td>
              </tr>
              <tr>
                <th>Địa chỉ</th>
                <td>{house.diaChi}</td>
              </tr>
              <tr>
                <th>Chủ nhà</th>
                <td>{house.tenChuNha}</td>
              </tr>
              <tr>
                <th>SĐT</th>
                <td>{house.sdt}</td>
              </tr>
              <tr>
                <th>Kích thước</th>
                <td>{house.kichThuocMin} - {house.kichThuocMax} m²</td>
              </tr>
              <tr>
                <th>Số phòng</th>
                <td>{house.soPhong}</td>
              </tr>
              <tr>
                <th>Giá thuê</th>
                <td>
                  {house.giaMin ? house.giaMin.toLocaleString() : "N/A"} -{" "}
                  {house.giaMax ? house.giaMax.toLocaleString() : "N/A"} VND/tháng
                </td>
              </tr>
              <tr>
                <th>Giá điện</th>
                <td>{house.tienDien.toLocaleString()} VND/kWh</td>
              </tr>
              <tr>
                <th>Giá nước</th>
                <td>{house.tienNuoc.toLocaleString()} VND/m³</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "amenities" && (
        <div className="house-amenities-table">
          <div className="amenities-scroll-wrapper">
            <p><b>Tiện nghi:</b></p>
            <table>
              <tbody>
                {chunkArray(tienNghiListAll, 2).map((row, index) => (
                  <tr key={index}>
                    {row.map((item) => {
                      const isAvailable = tienNghiArray.some(nt => nt.id === item.id);
                      return (
                        <td key={item.id}>
                          <span className={`icon ${isAvailable ? "yes" : "no"}`}>
                            {isAvailable ? "✔️" : "❌"}
                          </span> {item.tenTienNghi}
                        </td>
                      );
                    })}
                    {row.length < 2 && <td></td>}
                  </tr>
                ))}
              </tbody>
            </table>

            <p><b>Thông tin thêm:</b></p>
            <table>
              <tbody>
                {chunkArray(thongTinThemListAll, 2).map((row, index) => (
                  <tr key={index}>
                    {row.map((item) => {
                      const isAvailable = thongTinThemArray.some(nt => nt.id === item.id);
                      return (
                        <td key={item.id}>
                          <span className={`icon ${isAvailable ? "yes" : "no"}`}>
                            {isAvailable ? "✔️" : "❌"}
                          </span> {item.thongTinThem}
                        </td>
                      );
                    })}
                    {row.length < 2 && <td></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}




      {activeTab === "image" && (
        <>
          <h4>Hình ảnh nhà trọ</h4>
          {images.length > 0 ? (
            <Carousel showThumbs={false} infiniteLoop autoPlay>
              {images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Hình ảnh ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          ) : (
            <p style={{ color: "red" }}>Không có hình ảnh</p>
          )}
        </>
      )}

    </div>
  );
};


export default HousePopupDetail;
