import { useMap } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Routing = ({ from, to }) => {
  const map = useMap();
  const routingRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Kiểm tra map có sẵn chưa
  useEffect(() => {
    if (map && map._container) {
      setIsReady(true);
    }
  }, [map]);

  useEffect(() => {
    if (!isReady || !from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      lineOptions: {
        styles: [{ color: 'blue', weight: 5 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        });
      },
    });

    control.addTo(map);
    routingRef.current = control;

    return () => {
      if (map && routingRef.current && routingRef.current._container) {
        try {
          map.removeControl(routingRef.current);
        } catch (err) {
          console.warn('Safe cleanup error:', err);
        }
      }
    };
  }, [isReady, from, to]);

  return null;
};

export default Routing;
