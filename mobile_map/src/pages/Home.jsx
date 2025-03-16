import React, { useEffect, useState } from "react";
import Map from "../components/Map/Map";
import { getHouseDetail } from "../services/api"; // Import hàm gọi API
import Header from "../components/Header/Header";

const Home = () => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getHouseDetail();
            setHouses(data);
        };
        fetchData();
    }, []);

    return (
        
        <Map houses={houses} />

    )
};

export default Home;
