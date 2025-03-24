import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./HousePopupDetail.css";

import { fetchDanhGia, fetchGuiDanhGia, fetchImage, fetchThongTinThem, fetchTienNghi, getHouseDetail } from "../../services/api"; // Import hàm fetchTienIch

const HousePopupDetail = ({ house, onCoordinatesr, onShowRouting }) => {
  const [activeTab, setActiveTab] = useState("info");

  const [houseState, sethouseState] = useState(null);
  const [images, setImages] = useState([]);
  const [danhGiaList,setDanhGiaList] = useState([])
  const [trungBinhSao,settrungBinhSao] = useState([])

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


  const [noiDung, setNoiDung] = useState("");
  const [soSao, setSoSao] = useState(5);
  const [error, setError] = useState(null);

  const handleDanhGia = async () => {
    if (!noiDung.trim()) {
      setError("Vui lòng nhập nội dung đánh giá!");
      return;
    }
  
    try {
      const danhGiaData = { noiDung, soSao, id: 4 };
      const response = await fetchGuiDanhGia(id, danhGiaData);
      
      if (response) {
        alert(response.message);
        setNoiDung("");
        setSoSao(5);
        setError(null);
  
        // 🔄 Load lại danh sách đánh giá ngay sau khi gửi đánh giá thành công
        const updatedDanhGia = await fetchDanhGia(id);
        setDanhGiaList(updatedDanhGia.data.danhGiaList);
        settrungBinhSao(updatedDanhGia.data.trungBinhSao);
      } else {
        setError("Lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      setError("Lỗi kết nối đến server!");
    }
  };
  
  
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
        console.log(id)
       const data2 = await fetchDanhGia(id)
       console.log(data2)
        setThongTinThem([...data1.data.ThongTinThems]);
        setDanhGiaList([...data2.data.danhGiaList]);
        settrungBinhSao(data2.data.trungBinhSao ) // Cập nhật state thông tin thêm của nhà trọ
        // Cập nhật state thông tin thêm của nhà trọ
        console.log("🏠 Dữ liệu thông tin thêm:", data1.data.ThongTinThems);


        console.log("🏠 Dữ liệu tiện nghi:", data1.data.TienNghis);
        sethouseState(data1.data);



        if (typeof onCoordinatesr === "function") {
          const coordinates = { lat: data1.data.lat, lng: data1.data.lon };
          onCoordinatesr(coordinates);
          console.log("🏠 Dữ liệu tọa độ của trọ:", coordinates); // <--- log đúng dữ liệu
        }
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
        <button onClick={() => handleTabChange("info")} className={`tab-btn ${activeTab === "info" ? "active" : ""}`}>Giới thiệu</button>
        <button onClick={() => handleTabChange("amenities")} className={`tab-btn ${activeTab === "amenities" ? "active" : ""}`}>Chi tiết</button>
        <button onClick={() => handleTabChange("image")} className={`tab-btn ${activeTab === "image" ? "active" : ""}`}>Hình ảnh</button>
        <button onClick={() => handleTabChange("danhgia")} className={`tab-btn ${activeTab === "danhgia" ? "active" : ""}`}>Đánh giá</button>
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
              <tr>
                <th>Khoảng cách tới trường</th>
                <td> {house.khoangCachTruong} m</td>
              </tr>
              <tr>
                <th>Tình trạng</th>
                <td><b style={{ color: house.conPhong ? "green" : "red", fontWeight: "bold" }}>
                  {house.conPhong ? "Còn phòng" : "Hết phòng"}</b>
                </td>
              </tr>
              <tr>
                <th>Cập nhật</th>
                <td>{new Date(house.updatedAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <a href="#" onClick={(e) => {
            e.preventDefault();
            if (typeof onShowRouting === "function") {
              onShowRouting(); // gọi hàm từ cha và truyền house hiện tại
            }

          }}
            style={{ color: "blue", backgroundColor: "white" }}
          >
            Xem chỉ dẫn tới trọ
          </a>
        </div>
      )}

      {activeTab === "amenities" && (
        <div className="house-amenities-table">
          <div className="amenities-scroll-wrapper">
            <p><b>Tiện nghi:</b></p>
            <table>
              <tbody>
                {Array.isArray(tienNghiListAll) && chunkArray(tienNghiListAll, 2).map((row, index) => (
                  <tr key={index}>
                    {row.map((item) => {
                      const isAvailable = Array.isArray(tienNghiArray) && tienNghiArray.some(nt => nt.id === item.id);
                      return (
                        <td key={item.id}>
                          <span className={`icon ${isAvailable ? "yes" : "no"}`}>
                            {isAvailable ? "✔️" : "❌"}
                          </span> {item.tenTienNghi}
                        </td>
                      );
                    })}
                    {/* Nếu hàng chỉ có 1 cột thì thêm 1 <td> để đủ 2 cột */}
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


            <p style={{ color: "red" }}><b>Lưu ý:</b></p>
            <p>{house.ghiChu.toLocaleString()}</p>

          </div>
        </div>
      )}




      {activeTab === "image" && (
        <>

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
     {activeTab === "danhgia" && (
  <>
    {/* 📌 Tổng đánh giá & trung bình số sao */}
    <div className="mb-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold">
      📢 Đánh Giá: <span >{"⭐".repeat(Math.round(trungBinhSao))}</span>
      <br></br><small> ({danhGiaList.length} người đánh giá)</small>
      </h3>
    </div>

    {/* 📌 Danh sách đánh giá */}
    <div className="space-y-4">
    {danhGiaList.map((danhGia) => (
 <div key={danhGia.id} className="p-4 border rounded-lg">
 {/* Avatar + Tên (cùng hàng) */}
 <div className="flex items-center space-x-3">
 <img
  src={
    // danhGia.User?.avatar ||
    "http://localhost:8000/uploads/man.png"
  }
  alt="Avatar"
  width={20} 
  height={20}
  style={{ objectFit: "cover", borderRadius: "50%" }} // Tuỳ chỉnh hiển thị
/>
   <span className="font-semibold">  {danhGia.User?.fullname || "Ẩn danh"}</span>
 </div>

 {/* Số sao */}
 <p className="text-yellow-500 mt-1"> 👍 {"★".repeat(danhGia.soSao)}</p>

 {/* Nội dung đánh giá */}
 <p className="mt-2"> 📢 {danhGia.noiDung}</p>
</div>

))}

    </div>
    📌 Form đánh giá
    
    <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
  <h4 className="text-xl font-semibold mb-3">Viết đánh giá của bạn</h4>

  {/* Nhập nội dung đánh giá */}
  <textarea
    className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none"
    placeholder="Nhập nội dung đánh giá..."
    value={noiDung}
    onChange={(e) => setNoiDung(e.target.value)}
    rows={4}
  ></textarea>

  {/* Chọn số sao */}
  <div className="flex items-center space-x-2 mt-4">
  <div className="flex">
  <span className="font-medium">Chọn số sao:</span>
    {[1, 2, 3, 4, 5].map((sao) => (
      <button
        key={sao}
        className="text-3xl transition-colors"
        onClick={() => setSoSao(sao)}
        style={{ width: "20px", height: "20px", fontSize: "11px" }} // Giữ kích thước sao đồng nhất
      >
        {soSao >= sao ? "⭐" : "★"}
      </button>
    ))}
  </div>
</div>

  {/* Nút gửi đánh giá */}
  <button
  className="mt-6 w-full py-4 text-lg bg-green-600 text-white font-bold
             rounded-xl border-2 border-green-800 shadow-md
             hover:bg-green-700 hover:shadow-lg transition-all duration-300"
  onClick={handleDanhGia}
>
  Gửi đánh giá
</button>
</div>
  </>
)}

    </div>
  );
};


export default HousePopupDetail;