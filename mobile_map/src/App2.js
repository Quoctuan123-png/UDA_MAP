import React, { useState } from 'react';
import TinhNang1 from './TinhNang1';
import TinhNang2 from './TinhNang2';
import './khanh.css'; // Import file CSS

const App = () => {
  const [activeFeature, setActiveFeature] = useState(1); // State để theo dõi tính năng đang hiển thị

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Thanh ngang trên cùng (Header) */}
      <div style={{
        height: '80px',  
        backgroundColor: '#4CAF50',  
        color: 'white',  
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        <div>Logo</div>
        <div>Tên Trang</div>
      </div>

      {/* Phần chứa Sidebar và Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Thanh dọc bên trái (Sidebar) */}
        <div style={{
          width: '250px',
          backgroundColor: '#f4f4f4',
          paddingTop: '20px',
          position: 'relative',  
          zIndex: 10,
          height: 'calc(100vh - 80px)',  
          overflowY: 'auto',
        }}>
          <ul>
            <li onClick={() => setActiveFeature(1)}>Tính Năng 1</li>
            <li onClick={() => setActiveFeature(2)}>Tính Năng 2</li>
          </ul>
        </div>

        {/* Nội dung chính bên phải (Content) */}
        <div class = "content">
          {/* Hiển thị tính năng theo state */}
          {activeFeature === 1 && <TinhNang1 />}
          {activeFeature === 2 && <TinhNang2 />}
        </div>
      </div>
    </div>
  );
};

export default App;
