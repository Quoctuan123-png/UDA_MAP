import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import L from "leaflet";
import styles from "./Survey.module.scss";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { fetchTienNghi, fetchThongTinThem } from "../services/api"; // Import hàm fetchTienIch
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

const Survey = () => {
  const [showHide, setShowHide] = useState(false);
  const [showHideOne, setShowHideOne] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [position, setPosition] = useState(null);// State để lưu tọa độ
  const [tienNghiList, setTienNghiList] = useState([]); //lưu tiennghi
  const [thongtinthemList, setThongTinThemList] = useState([]); //lưu tiennghi
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    tenPhongTro: "",
    tenChuNha: "",
    diaChi: "",
    sdt: "",
    soPhong: "",
    giaMin: "",
    giaMax: "",
    kichThuocMin: "",
    kichThuocMax: "",
    tienNghi: [],
    tienDien: "",
    tienNuoc: "",
    trangThai: false,
    ghiChu: "",
    lat: "", // Thêm trường tọa độ X
    lon: "", // Thêm trường tọa độ Y
    thongTinThem: [],
  });


  const houseIcon = new L.DivIcon({
    html: '<i class="fas fa-map-marker-alt" style="font-size: 24px; color: red;"></i>',
    className: "custom-div-icon",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  // Nhập input
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Chọn ảnh
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Box change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      tienNghi: checked
        ? [...prev.tienNghi, value] // Nếu được chọn → thêm vào mảng
        : prev.tienNghi.filter((item) => item !== value), // Nếu bỏ chọn → loại bỏ khỏi mảng
    }));
  };


  // Box change1
  const handleCheckboxChange1 = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      thongTinThem: checked
        ? [...prev.thongTinThem, value] // Nếu được chọn → thêm vào mảng
        : prev.thongTinThem.filter((item) => item !== value), // Nếu bỏ chọn → loại bỏ khỏi mảng
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi thông tin trọ trước
      console.log("dữ liệu gửi đi:  ", formData);
      const infoResponse = await axios.post("http://localhost:8000/api/nha-tro", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Kiểu dữ liệu:", infoResponse.data);

      // Sau khi gửi thông tin trọ, lấy ID để gửi hình ảnh
      if (selectedImage) {
        const formDataImage = new FormData();
        formDataImage.append("image", selectedImage); // Đổi key từ "image" thành "images"
        formDataImage.append("nhaTroId", infoResponse.data.nhaTro.id); // Gửi ID của nhà trọ lên backend

        const imageResponse = await axios.post("http://localhost:8000/api/upload-single", formDataImage, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Hình ảnh gửi thành công:", imageResponse.data);
      }

      // Thông báo gửi thông tin thành công
      toast.success("Gửi thông tin thành công!");
    } catch (error) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
      } else {
        console.error("Lỗi khi thiết lập request:", error.message);
      }
    }
  };

  // Component để xử lý sự kiện bản đồ và lấy tọa độ
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        console.log("Tọa độ được chọn:", e.latlng);
        setFormData((prev) => ({
          ...prev,
          lat: e.latlng.lat,
          lon: e.latlng.lng,
        }));
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={houseIcon}>
        <Popup>Bạn đã chọn vị trí này</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const fetchtiennghi1 = async () => {
      try {
        const response = await fetchTienNghi();
        const response1 = await fetchThongTinThem();
        console.log("Dữ liệu thêm:", response1);
        console.log("Dữ liệu tiện nghi:", response);
        setTienNghiList(response);
        setThongTinThemList(response1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nội thất:", error);
      }
    };

    fetchtiennghi1();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <header className={cx("header")}>
        <p className={cx("heading_title")}>GIỚI THIỆU NHÀ TRỌ</p>
        <button className={cx("clear")} onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </header>
      <div className={cx("content")}>
        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Tên nhà trọ</h3>
          <input
            type="text"
            name="tenPhongTro"
            className={cx("form_input")}
            placeholder="Nhập tên trọ"
            value={formData.tenPhongTro} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Tên chủ trọ</h3>
          <input
            type="text"
            name="tenChuNha"
            value={formData.tenChuNha} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Số điện thoại chủ trọ</h3>
          <input
            type="text"
            name="sdt"
            value={formData.sdt} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Địa chỉ nhà trọ</h3>
          <input
            type="text"
            name="diaChi"
            value={formData.diaChi} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập số nhà, đường, quận, thành phố"
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Số phòng trọ</h3>
          <input
            type="text"
            name="soPhong"
            value={formData.soPhong} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập tổng số phòng trọ"
          />
        </div>



        <div className={cx("dien-tich-container")}>
          <h2>Mức giá (VND/tháng) </h2>
          <div className={cx("dien-tich-container1")}>
            <div className={cx("dien-tich-item")}>
              <span className={cx("dien-tich-label")}></span>
              <input
                type="number"
                name="giaMin"
                className={cx("dien-tich-input")}
                placeholder="Nhập giá tối thiểu"
                value={formData.giaMin}
                onChange={handleInputChange}
              />
            </div>
            <p>   --   </p>
            <div className={cx("dien-tich-item")}>
              <span className={cx("dien-tich-label")}></span>
              <input
                type="number"
                name="giaMax"
                className={cx("dien-tich-input")}
                placeholder="Nhập giá tối đa"
                value={formData.giaMax}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={cx("dien-tich-container")}>
          <h2>Diện tích (m2)</h2>
          <div className={cx("dien-tich-container1")}>
            <div className={cx("dien-tich-item")}>
              <span className={cx("dien-tich-label")}></span>
              <input
                type="number"
                name="kichThuocMin"
                className={cx("dien-tich-input")}
                placeholder="Ví dụ: 20"
                value={formData.kichThuocMin}
                onChange={handleInputChange}
              />
            </div>
            <p>   --   </p>
            <div className={cx("dien-tich-item")}>
              <span className={cx("dien-tich-label")}></span>
              <input
                type="number"
                name="kichThuocMax"
                className={cx("dien-tich-input")}
                placeholder="Ví dụ: 30 "
                value={formData.kichThuocMax}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>



        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Giá điện</h3>
          <input
            type="text"
            name="tienDien"
            value={formData.tienDien} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập giá điện (VNĐ/kWh)"
          />
        </div>
        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Giá nước</h3>
          <input
            type="text"
            name="tienNuoc"
            value={formData.tienNuoc} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập giá nước (VNĐ/m³)"
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Tiện nghi phòng</h3>
          <div className={cx("option_item")}>
            {tienNghiList.map((item) => (
              <div key={item.id} className={cx("item")}>
                <input
                  type="checkbox"
                  className={cx("option_checkbox")}
                  value={item.id}
                  onChange={handleCheckboxChange}
                />
                <p className={cx("option_title")}>{item.tenTienNghi}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Thông tin thêm</h3>
          <div className={cx("option_item")}>
            {thongtinthemList.map((item) => (
              <div key={item.id} className={cx("item")}>
                <input
                  type="checkbox"
                  className={cx("option_checkbox")}
                  value={item.id}
                  onChange={handleCheckboxChange1}
                />
                <p className={cx("option_title")}>{item.thongTinThem}</p>
              </div>
            ))}
          </div>
        </div>




        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Upload Image</h3>
          <input
            type="file"
            accept="image/*"
            className={cx("form_input")}
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div>
              <img
                className={cx("image_preview")}
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
              />
            </div>
          )}
        </div>


        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Ghi chú</h3>
          <input
            type="text"
            name="ghiChu"
            value={formData.ghiChu} // Ràng buộc với state
            onChange={handleInputChange} // Cập nhật state khi nhập
            className={cx("form_input")}
            placeholder="Nhập ghi chú"
          />
        </div>

        <div className={cx("form_group")}>
          <h3 className={cx("form_title")}>Chọn vị trí trên bản đồ</h3>
          <MapContainer

            center={[16.032, 108.2212]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        <button className={cx("btn")} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Survey;