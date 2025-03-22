import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSwipeable } from "react-swipeable";
import {
  faMagnifyingGlass,
  faList,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../Header/Header.css";
import Filter from "../../Filter/Filter";
import Survey from "../../Survey/Survey";

const Header = ({
  isInnerVisible,
  onSearchClick,
  onReset,
  onFilter,
  showModal,
  onInner,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("Filter");

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isInnerVisible) {
        onReset();
      }
    },

    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 50,
    swipeDuration: 500,
  });

  useEffect(() => {
    if (!isInnerVisible) {
      setIsMenuOpen(false);
    }
  }, [isInnerVisible]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleContentChange = (content) => {
    setActiveContent(content);
    setIsMenuOpen(false);
  };

  const handleCloseSurvey = () => {
    setActiveContent("Filter");
  };

  return (
    <div
      {...handlers}
      className={`inner ${isInnerVisible ? "visible" : "hidden"}`}
    >
      <header className="header">
        <div className="logo-list" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faList} />
        </div>
        <div className="logo">
          <img src="images/UDA_logo.png" alt="Logo" />
          <div className="text">
            <h3 className="text-1">UDA MAP</h3>
            <h4 className="tex-2">Bản đồ phòng trọ sinh viên UDA</h4>
          </div>
        </div>
        <div
          onClick={() => handleContentChange("Filter")}
          className="logo-find"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        <div className="logo-left" onClick={handleReset}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>

        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => handleContentChange("Survey")}>
              <span>Giới thiệu phòng trọ</span>
            </li>
            <li>
              <span>Diễn đàn</span>
            </li>
            <li>
              <span>Liên hệ</span>
            </li>
          </ul>
        </div>
      </header>
      <div className="content_list">
        {activeContent === "Filter" && (
          <Filter onReset={onReset} onFilter={onFilter} />
        )}

        {activeContent === "Survey" && (
          <Survey onCloseSurvey={handleCloseSurvey} showModal={showModal} />
        )}
      </div>
    </div>
  );
};

export default Header;
