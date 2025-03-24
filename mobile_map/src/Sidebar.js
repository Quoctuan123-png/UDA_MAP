import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <ul style={styles.list}>
        <li style={styles.listItem}><Link to="/tinh-nang-1">Tính năng 1</Link></li>
        <li style={styles.listItem}><Link to="/tinh-nang-2">Tính năng 2</Link></li>
        <li style={styles.listItem}><Link to="/tinh-nang-3">Tính năng 3</Link></li>
        {/* Thêm các tính năng khác ở đây */}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
  },
};

export default Sidebar;
