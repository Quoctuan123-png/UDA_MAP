import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchLocations, fetchTienIch } from "../../services/api";
import CustomPopup from "../Popup/CustomPopup";
import "./Map.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'leaflet.fullscreen/Control.FullScreen.css';
import 'leaflet.fullscreen';

// Vị trí mặc định của trường Đại học Đông Á
const universityLocation = [16.032, 108.2212];

// Custom Control Button
const TienIchToggleControl = ({ onToggle, show }) => {
    const map = useMap();

    useEffect(() => {
        const control = L.control({ position: "topleft" });

        control.onAdd = () => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
            container.style.backgroundColor = "#fff";
            container.style.width = "34px";
            container.style.height = "34px";
            container.style.cursor = "pointer";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "center";
            container.title = show ? "Ẩn tiện ích" : "Hiện tiện ích";

            container.innerHTML = show
                ? `<i class="fas fa-eye-slash" style="font-size:18px;"></i>`
                : `<i class="fas fa-eye" style="font-size:18px;"></i>`;
            container.onclick = () => {
                onToggle();
                container.title = !show ? "Ẩn tiện ích" : "Hiện tiện ích";
                container.innerHTML = !show ? `<i class="fas fa-eye-slash"></i>` : `<i class="fas fa-eye"></i>`;
            };

            return container;
        };

        control.addTo(map);

        return () => {
            control.remove();
        };
    }, [map, onToggle, show]);

    return null;
};


// Hàm tạo icon từ Font Awesome
const createFAIcon = (faClass, bgColor = "#fff", color = "#000") =>
    L.divIcon({
        className: "custom-fa-icon",
        html: `<div style="background: ${bgColor}; border-radius: 50%; padding: 5px; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px;">
             <i class="${faClass}" style="color:${color}; font-size:10px;"></i>
           </div>`,
        iconSize: [20, 20],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

// Gán icon tiện ích bằng Font Awesome
const iconsTienIch = {
    "chợ": createFAIcon("fas fa-store", "#FFB74D", "#fff"),          // Xám trung tính
    "bệnh viện": createFAIcon("fas fa-hospital", "#64B5F6", "#fff"), // Xanh dương nhạt
    "siêu thị": createFAIcon("fas fa-shopping-cart", "#A1887F", "#fff"), // Nâu nhạt
    "nhà thuốc": createFAIcon("fas fa-pills", "#BA68C8", "#fff"),    // tím nhạt
    "nhà thờ": createFAIcon("fas fa-church", "#B0BEC5", "#fff"),     // Xanh ghi nhạt
    "chùa": createFAIcon("fas fa-torii-gate ", "#9E9E9E", "#fff"),             // Xanh pastel
    "cửa hàng": createFAIcon("fas fa-store-alt", "#FFD54F", "#fff")  // Vàng pastel
};


// Hàm chọn icon tiện ích dựa vào tên
const getTienIchFAIcon = (tenTienIch = "") => {
    const loai = tenTienIch.toLowerCase();
    return iconsTienIch[Object.keys(iconsTienIch).find(key => loai.includes(key))] || iconsTienIch["chợ"];
};

const Map = ({ filteredData1, onCoordinatesr, onShowRouting }) => {
    const [filteredHouses, setFilteredHouses] = useState([]);
    const [tienIchList, setTienNghiList] = useState([]);
    const [showTienIch, setShowTienIch] = useState(true); // 👉 Trạng thái bật/tắt tiện ích

    // Icon trường học
    const universityIcon = new L.Icon({
        iconUrl: "images/udalogo-removebg-preview.png",
        className: "custom-div-iconuni",
        iconSize: [35, 35],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    // Icon nhà trọ
    const housedoIcon = new L.Icon({
        iconUrl: "images/logohouse-removebg-preview.png",
        className: "custom-div-icon",
        iconSize: [28, 28],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const housexanhIcon = new L.Icon({
        iconUrl: "images/logoxanh.png",
        className: "custom-div-iconxanh",
        iconSize: [34, 34],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const getHouseIconByStatus = (status) => (status ? housexanhIcon : housedoIcon);

    // Chuẩn hóa dữ liệu nhà trọ
    const formatHouses = (data) => {
        return data
            .map((house) => {
                if (!house.lat || !house.lon) return null;
                const latitude = parseFloat(house.lat);
                const longitude = parseFloat(house.lon);
                if (isNaN(latitude) || isNaN(longitude)) return null;
                return { ...house, latitude, longitude };
            })
            .filter((house) => house !== null);
    };

    useEffect(() => {
        const loadHouses = async () => {
            try {
                if (filteredData1 && filteredData1.length > 0) {
                    console.log("✅ filteredData1 từ Home:", filteredData1);
                    const formatted = formatHouses(filteredData1);
                    setFilteredHouses(formatted);
                } else {
                    console.log("📥 Lấy dữ liệu từ API...");
                    const formatted1 = await fetchTienIch();
                    const data = await fetchLocations();
                    const formatted = formatHouses(data);
                    setFilteredHouses(formatted);
                }
            } catch (error) {
                console.error("❌ Lỗi khi tải dữ liệu nhà trọ:", error);
            }
        };

        loadHouses();
    }, [filteredData1]);

    // Lấy danh sách tiện ích
    useEffect(() => {
        const fetchTienIchList = async () => {
            try {
                const response = await fetchTienIch();
                console.log("✅ Dữ liệu tất cả Tiện ích:", response);
                setTienNghiList(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tiện ích:", error);
            }
        };

        fetchTienIchList();
    }, []);

    return (
        <div className="map">
            <MapContainer
                center={universityLocation}
                zoom={15}
                scrollWheelZoom={true}
                fullscreenControl={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TienIchToggleControl
                    onToggle={() => setShowTienIch(!showTienIch)}
                    show={showTienIch}
                />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> & contributors & CartoDB"
                />

                <Marker position={universityLocation} icon={universityIcon}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Trường Đại học Đông Á</div>
                    </Tooltip>
                    <Popup>
                        <div className="popup-container">
                            <div className="popup-image">
                                <img
                                    src="https://cdn.nhanlucnganhluat.vn/uploads/images/360e09f7/source/2018-11/dai-hoc-a-15260318284302087536677.jpg"
                                    alt="logo"
                                    style={{ width: "100%", height: "40%" }}
                                />
                            </div>
                            <div className="popup-university">
                                <h2>Trường Đại học Đông Á</h2>
                                <p><i className="fas fa-map-marker-alt"></i> Địa chỉ: 33 Xô Viết Nghệ Tĩnh, Hòa Cường Nam</p>
                                <p><i className="fas fa-globe"></i> <a href="https://donga.edu.vn/gioi-thieu">donga.edu.vn</a></p>
                                <p><i className="fas fa-phone"></i> SĐT: 02363519991</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {filteredHouses.map((house, index) => (
                    <Marker key={index} position={[house.latitude, house.longitude]} icon={getHouseIconByStatus(house.conPhong)}>
                        <Popup>
                            <CustomPopup house={house} onCoordinatesr={onCoordinatesr} onShowRouting={onShowRouting} />
                        </Popup>
                    </Marker>
                ))}

                {showTienIch && tienIchList.map((item, index) => (
                    item.lat && item.lon && item.TienIch && (
                        <Marker
                            key={`tienich-${index}`}
                            position={[item.lat, item.lon]}
                            icon={getTienIchFAIcon(item.TienIch.tenTienIch)}
                        >
                            <Popup>
                            <div className="popup-container">

                            <div className="popup-university">
                                <h2>{item.TienIch.tenTienIch}</h2>
                                <p><i className="fas fa-map-marker-alt"></i> {item.TienIch.tenTienIch}</p>
                            </div>
                        </div>
                            </Popup>
                        </Marker>
                    )
                ))}

            </MapContainer>
        </div>
    );
};

export default Map;
