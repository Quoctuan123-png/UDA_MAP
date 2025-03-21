import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { fetchLocations } from "../../services/api";
import CustomPopup from "../Popup/CustomPopup";
import "./Map.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const universityLocation = [16.032, 108.2212];

const Map = ({ filteredData1, onCoordinatesr, onShowRouting }) => {
    const [filteredHouses, setFilteredHouses] = useState([]);

    // 📌 Hàm chuẩn hóa dữ liệu vị trí
    const formatHouses = (data) => {
        return data
            .map((house) => {
                if (!house.lat || !house.lon) return null;
                const latitude = parseFloat(house.lat);
                const longitude = parseFloat(house.lon);
                if (isNaN(latitude) || isNaN(longitude)) return null;
                return {
                    ...house,
                    latitude,
                    longitude
                };
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

                    const data = await fetchLocations();
                    const formatted = formatHouses(data);
                    setFilteredHouses(formatted);
                    console.log("📥 Lấy dữ liệu từ API vì filteredData1 rỗng...", data);
                }
            } catch (error) {
                console.error("❌ Lỗi khi tải dữ liệu nhà trọ:", error);
            }
        };

        loadHouses();
    }, [filteredData1]);

    const universityIcon = new L.Icon({
        iconUrl: "images/udalogo-removebg-preview.png",
        className: "custom-div-iconuni",
        iconSize: [50, 50],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const housedoIcon = new L.Icon({
        iconUrl: "images/logohouse-removebg-preview.png",
        className: "custom-div-icon",
        iconSize: [35, 35],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const housexanhIcon = new L.Icon({
        iconUrl: "images/logoxanh.png",
        className: "custom-div-iconxanh",
        iconSize: [45, 45],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });


    const getHouseIconByStatus = (status) =>
        status ? housexanhIcon : housedoIcon;

    return (
        <div className="map">
            <MapContainer
                center={universityLocation}
                zoom={15}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={universityLocation} icon={universityIcon}>
                    <Tooltip
                        direction="top"
                        offset={[10, 0]} // 👈 Dịch tooltip qua trái (giá trị âm sẽ đẩy sang trái)
                        opacity={1}
                        permanent
                    >
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Trường Đại học Đông Á</div>
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
                                <div className="popup-info">
                                    <p><i className="fas fa-map-marker-alt"></i>Địa chỉ: 33 Xô Viết Nghệ Tĩnh, Hòa Cường Nam</p>
                                    <p><i className="fas fa-globe"></i> <a href="https://donga.edu.vn/gioi-thieu">Link:    donga.edu.vn</a></p>
                                    <p><i className="fas fa-phone"></i>SĐT:    02363519991</p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {filteredHouses.map((house, index) => (

                    <Marker
                        key={index}
                        position={[house.latitude, house.longitude]}
                        icon={getHouseIconByStatus(house.conPhong)}
                    >
                        <Popup className="popup-hostel">
                            <CustomPopup house={house} onCoordinatesr={onCoordinatesr} onShowRouting={onShowRouting} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
