import React, { useEffect, useState } from "react";
import Map from "../components/Map/Map";
import { getHouseDetail } from "../services/api"; // Import hàm gọi API
import Header from "../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Directions from "./Directions";
import styles from "../style/home.css";
import {
  faCaretLeft,
  faCircleCheck,
  faCaretRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [isInnerVisible, setIsInnerVisible] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [houses, setHouses] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const showModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 4000);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleFilter = (data) => {
    setFilteredData(data); // Cập nhật dữ liệu từ Filter
    console.log(data);
  };

  const handleCoordinates = (data) => {
    setCoordinates(data); // Cập nhật dữ liệu tọa độ nhà trọ
    console.log(data);
  };

  const toggleInner = () => {
    setIsInnerVisible(!isInnerVisible);
  };

  const resetInner = () => {
    setIsInnerVisible(false);
  };

  const onInner = () => {
    setIsInnerVisible(true);
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
      {isModalVisible && (
        <div className="modal">
          <div className="modal_content">
            <button className="icon_close" onClick={hideModal}>
              {" "}
              <FontAwesomeIcon className="" icon={faClose} />
            </button>
            <div className="modal_header">
              <FontAwesomeIcon className="check_circle" icon={faCircleCheck} />
            </div>
            <div className="modal_body">
              <p className="modal_desc">Đã gửi thông tin thành công</p>
              <p className="modal_note">
                Thông tin của bạn sẽ được up lên sau khi được <br />
                admin kiểm duyệt.
              </p>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={toggleInner}
        className={`btn_pull ${isInnerVisible ? "visible" : "hidden"}`}
      >
        <FontAwesomeIcon
          className="icon_right"
          icon={isInnerVisible ? faCaretLeft : faCaretRight}
        />
      </button>

      <Header
        isInnerVisible={isInnerVisible}
        onReset={resetInner}
        onFilter={handleFilter}
        showModal={showModal}
        onInner={onInner}
      />
      <Map
        houses={houses}
        filteredData1={filteredData}
        onCoordinatesr={handleCoordinates}
      />
      <Directions Coordinates={coordinates} />
    </div>
  );
};

export default Home;
