import React, { useEffect, useState } from "react";
import Map from "../components/Map/Map";
import { getHouseDetail } from "../services/api"; // Import hàm gọi API
import Header from "../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Directions from "./Directions";
import styles from "../style/home.css";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [isInnerVisible, setIsInnerVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [houses, setHouses] = useState([]);
    const [coordinates, setCoordinates] = useState([]);



    const handleFilter = (data) => {
        setFilteredData(data); // Cập nhật dữ liệu từ Filter  
        console.log(data)
    };


    const handleCoordinates = (data) => {
        setCoordinates(data); // Cập nhật dữ liệu tọa độ nhà trọ  
        console.log(data)
    };

    const toggleInner = () => {
        setIsInnerVisible(!isInnerVisible);
    };

    const resetInner = () => {
        setIsInnerVisible(false);
    };




    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await getHouseDetail();
    //         setHouses(data);
    //     };
    //     fetchData();
    // }, []);

    return (
        <div className="home_wrapper">
            <FontAwesomeIcon
                className="icon_right"
                icon={faCaretRight}
                onClick={toggleInner} // Thêm sự kiện click
            />
            <Header isInnerVisible={isInnerVisible} onReset={resetInner} onFilter={handleFilter} />
            <Map houses={houses} filteredData1={filteredData} onCoordinatesr={handleCoordinates} />
            <Directions Coordinates={coordinates} />
        </div>
    );
};

export default Home;
