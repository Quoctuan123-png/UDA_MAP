import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faList } from '@fortawesome/free-solid-svg-icons';
import '../Header/Header.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onSearchClick }) => {
  // State để kiểm tra khi nào menu sẽ hiển thị
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý khi nhấn vào icon faList
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Đảo ngược trạng thái menu
  };

  // Hàm xử lý khi nhấn vào icon tìm kiếm
  const handleSearchClick = () => {
    setShowSearchForm(!showSearchForm);
    if (onSearchClick) {
      onSearchClick();
    }
  };

  return (
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
      <div className="logo-find" onClick={handleSearchClick}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </div>

      {/* Menu bên trái */}
      <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/survey">Giới thiệu phòng trọ</Link>
          </li>
          <li>Diễn đàn</li>
          <li>Liên hệ</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;