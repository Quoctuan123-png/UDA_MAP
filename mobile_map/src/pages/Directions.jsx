import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Routing from './Routing';
import 'leaflet/dist/leaflet.css';

const Directions = () => {
  const [userLocation, setUserLocation] = useState(null);

  // Vị trí đích: Đại học Đông Á16.0377393,108.2190762,15.82z
  const to = { lat: 16.0377393, lng: 108.2190762 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("Vị trí của bạn:", position)

        }
        ,
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
        }
      );

    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  }, []);

  if (!userLocation) {
    return <p>Đang lấy vị trí của bạn...</p>;
  }

  return (
    <div style={{ height: '0', width: '0' }}>
      <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation} />
        <Marker position={to} />
        <Routing from={userLocation} to={to} />
      </MapContainer>
    </div>
  );
};

export default Directions;
