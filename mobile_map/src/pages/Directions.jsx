import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Routing from './Routing';
import 'leaflet/dist/leaflet.css';
import './Directions.css';
import L from 'leaflet';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Directions = ({ Coordinates, onBack }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [isRoutingReady, setIsRoutingReady] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Lỗi lấy vị trí người dùng:", error);
                }
            );
        } else {
            alert("Trình duyệt không hỗ trợ định vị.");
        }
    }, []);

    if (!userLocation || !Coordinates?.lat || !Coordinates?.lng) {
        return <p>Đang tải vị trí người dùng...</p>;
    }

    const to = { lat: Coordinates.lat, lng: Coordinates.lng };


    return (
        <div style={{ position: "relative", height: '100vh', width: '100%' }}>
            {/* 🔙 Nút quay lại */}
            <button
                className='btn_back'
                onClick={onBack}
                style={{
                    position: "absolute",

                    zIndex: 1000,
                    padding: "8px 12px",
                    background: "#ffffffcc",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                }}
            >
                🔙 Quay lại bản đồ
            </button>

            {!isRoutingReady && (
                <div
                    style={{
                        position: 'absolute',
                        top: 70,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#fff',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        fontWeight: 'bold'
                    }}
                >
                    Đang tải dữ liệu chỉ đường, vui lòng đợi...
                </div>
            )}

            <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={userLocation} >
                    <Tooltip
                        direction="top"
                        offset={[-10, 0]} // 👈 Dịch tooltip qua trái (giá trị âm sẽ đẩy sang trái)
                        opacity={1}
                        permanent
                    >
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Vị trí của bạn</div>
                    </Tooltip>
                </Marker>

                <Marker position={to}>
                    <Tooltip
                        direction="top"
                        offset={[-10, 0]} // 👈 Dịch tooltip qua trái (giá trị âm sẽ đẩy sang trái)
                        opacity={1}
                        permanent
                    >
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Vị trí nhà trọ</div>
                    </Tooltip>
                </Marker>
                <Routing from={userLocation} to={to} onRouteReady={() => setIsRoutingReady(true)} />
            </MapContainer>
        </div>
    );
};

export default Directions;
