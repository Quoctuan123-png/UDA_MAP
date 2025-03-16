import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { fetchLocations } from "../../services/api"; // Import API
import Filter from "../../Filter/Filter"; // Import Filter component
import Header from "../Header/Header"; // Import Header component
import HousePopupDetail from "../Popup/HousePopupDetail"; // điều chỉnh path tùy vào bạn đặt file
import CustomPopup from "../Popup/CustomPopup"; // điều chỉnh path tùy vào bạn đặt file
import "./Map.css";

const universityLocation = [16.032, 108.2212];

const Map = () => {
    const [houses, setHouses] = useState([]);
    const [filteredHouses, setFilteredHouses] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const data = await fetchLocations();
                const formattedHouses = data
                    .map(house => {
                        if (house.lat === undefined || house.lon === undefined) return null;
                        const latitude = parseFloat(house.lat);
                        const longitude = parseFloat(house.lon);
                        if (isNaN(latitude) || isNaN(longitude)) return null;
                        return { ...house, latitude, longitude };
                    })
                    .filter(house => house !== null);
                setHouses(formattedHouses);
                setFilteredHouses(formattedHouses);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu nhà trọ:", error);
            }
        };

        fetchHouses();
    }, []);

    const handleFilter = (filteredData) => {
        console.log(filteredData);
        setFilteredHouses(filteredData);
    };

    const handleSearchClick = () => {
        setShowSearchForm(!showSearchForm);
    };

    const universityIcon = new L.DivIcon({
        html: '<i class="fas fa-school" style="font-size: 24px; color: rgba(25, 140, 65, 1);"></i>',
        className: "custom-div-icon",
        iconSize: [50, 50],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const houseIcon = new L.DivIcon({
        html: '<i class="fas fa-home" style="font-size: 18px; color: red;"></i>',
        className: "custom-div-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <Header onSearchClick={handleSearchClick} />
            <MapContainer
                center={universityLocation}
                zoom={15}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={universityLocation} icon={universityIcon}>
                    <Popup options={{ className: 'popup-school' }}>
                        <div>
                            <b>Trường Đại học Đông Á</b>
                            <br />
                            Địa chỉ: 33 Xô Viết Nghệ Tĩnh, Đà Nẵng
                        </div>
                    </Popup>
                </Marker>

                {filteredHouses.map((house) => (
                    <Marker position={[house.lat, house.lon]} icon={houseIcon}>
                        <Popup options={{ className: 'popup-hostel' }}>
                            <div>
                                <CustomPopup house={house} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

        </div>
    );
};

export default Map;