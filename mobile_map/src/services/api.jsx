
import axios from "axios";

const API_URL = "http://localhost:8000/api/nha-tro"; // Thay bằng API thực tế

// Hàm lấy dữ liệu nhà trọ từ API
export const fetchLocations = async () => {
    try {
        const response = await axios.get(API_URL);
        // console.log("tiennghi: ", response.data)
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return [];
    }
};

// Hàm lấy chi tiết nhà trọ theo ID
export const getHouseDetail = async (id) => {
    try {
        const room = await axios.get(`http://localhost:8000/api/getroom/${id}`);
        console.log(room)
        return room;

    } catch (error) {

    }
}


//call api lấy hình ảnh
export const fetchImage = async (Id) => {
    try {
        const response = await fetch(`http://localhost:8000/api/getimg/${Id}`);
        if (!response.ok) throw new Error("❌ Lỗi tải ảnh từ API");

        const data = await response.json();
        console.log("📌 Dữ liệu API trả về:", data);

        // Kiểm tra dữ liệu ảnh hợp lệ
        if (!Array.isArray(data) || data.length === 0 || !data[0].hinhAnh) {
            console.error("⚠️ Không có dữ liệu ảnh hợp lệ:", data);
            return null;
        }

        // 🟢 Lấy Buffer chứa đường dẫn ảnh
        const bufferData = data[0].hinhAnh.data;
        if (!bufferData || !Array.isArray(bufferData)) {
            console.error("❌ Dữ liệu ảnh không đúng định dạng Buffer", bufferData);
            return null;
        }

        // 🔥 Chuyển Buffer thành chuỗi đường dẫn
        const imagePath = String.fromCharCode(...bufferData);
        console.log("✅ Đường dẫn ảnh trên server:", imagePath);

        // 🖼️ Ghép domain để tạo URL ảnh hợp lệ
        const fullImageUrl = `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`;
        console.log("🔗 URL ảnh hợp lệ:", fullImageUrl);

        return fullImageUrl; // Trả về URL ảnh đầy đủ
    } catch (error) {
        console.error("🔥 Lỗi khi tải ảnh:", error);
        return null;
    }
};

// Hàm tìm tọa độ từ địa chỉ
export const fetchFind = async (Id) => {
    try {
        const response = await fetch(`http://localhost:8000/api/find-nha-tro`);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.log(error)
    }

}

// // Hàm lấy thông tin tiện ích
// export const fetchTienIch = async (lon, lat) => {
//     try {
//         const response = await fetch(`http://localhost:8000/api/findtienich`);
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi khi lấy thông tin tiện ích:", error);
//         throw error;
//     }
// };

// Hàm tìm tiện nghi
export const fetchTienNghi = async () => {
    try {
        const response = await fetch(`http://localhost:8000/api/tien-nghi`);
        const data = await response.json();

        console.log(data)
        return data;
    } catch (error) {
        console.log(error)
    }

}

// Hàm gọi thông tin thêm
export const fetchThongTinThem = async (Id) => {
    try {
        const response = await fetch(`http://localhost:8000/api/thong-tin-them`);
        const data = await response.json();
        console.log("thông tin thêm:  ", data)
        return data;
    } catch (error) {
        console.log(error)
    }

}

