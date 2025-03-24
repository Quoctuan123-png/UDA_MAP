import React from 'react';

const Header = () => {
  return (
    <div style={styles.header}>
      <img src="https://via.placeholder.com/40" alt="Logo" style={styles.logo} />
      <h1 style={styles.title}>Trang Quản Lý</h1>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#4CAF50', // Màu nền của header (màu xanh lá)
    color: '#fff', // Màu chữ trắng
    padding: '20px 30px', // Tăng kích thước padding để header to hơn
    height: '80px', // Tăng chiều cao của header
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,  // Đảm bảo header luôn ở trên
  },
  logo: {
    width: '50px', // Tăng kích thước logo
    height: '50px', // Tăng kích thước logo
    marginRight: '15px', // Khoảng cách giữa logo và tên
  },
  title: {
    margin: 0,
    fontSize: '24px', // Tăng kích thước chữ
    fontWeight: 'bold', // Làm cho chữ đậm hơn
  },
};

export default Header;
