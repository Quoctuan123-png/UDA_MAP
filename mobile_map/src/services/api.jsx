import axios from "axios";
// const API_URL = "http://localhost:8000";
const API_URL = "https://26b9-42-114-92-17.ngrok-free.app";



// Hàm lấy dữ liệu nhà trọ từ API
export const fetchLocations = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/nha-tro`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        })
        console.log(response.data

        )
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
        const room = await axios.get(`${API_URL}/api/getroom/${id}`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });
        console.log(room)
        return room;

    } catch (error) {

    }
}


//call api lấy hình ảnh
export const fetchImage = async (Id) => {
    try {
        const response = await fetch(`${API_URL}/api/getimg/${Id}`, {
            headers: {
                "ngrok-skip-browser-warning": "true",
            },
        });

        if (!response.ok) throw new Error("❌ Lỗi tải ảnh từ API");

        const data = await response.json();
        console.log("📌 Dữ liệu API trả về:", data);

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ Không có dữ liệu ảnh hợp lệ");
            return [];
        }

        // Fetch từng ảnh và tạo blob URLs
        const imageBlobUrls = await Promise.all(
            data.map(async (item) => {
                let path = item.hinhAnh?.trim()?.replace(/\\/g, "/");
                if (!path) return null;

                const imgRes = await fetch(`${API_URL}/${path}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                if (!imgRes.ok) {
                    console.warn("⚠️ Không tải được ảnh:", path);
                    return null;
                }

                const blob = await imgRes.blob();
                return URL.createObjectURL(blob);
            })
        );

        return imageBlobUrls.filter((url) => url !== null);
    } catch (error) {
        console.error("🔥 Lỗi khi fetchImage:", error);
        return [];
    }
};

// Hàm tìm tọa độ từ địa chỉ
export const fetchFind = async (formData) => {
    try {
        const response = axios.post(`${API_URL}/api/find-nha-tro`,
            formData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        // const response = await axios.post(`${API_URL}/api/find-nha-tro`, {
        //     headers: {
        //         "ngrok-skip-browser-warning": "true"
        //     }
        // });
        const data = await response;
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
//     } catch (error) {//         console.error("Lỗi khi lấy thông tin tiện ích:", error);
//         throw error;
//     }
// };

// Hàm tìm tiện nghi
export const fetchTienNghi = async () => {
    try {
        const response = await fetch(`${API_URL}/api/tien-nghi`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });
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
        const response = await fetch(`${API_URL}/api/thong-tin-them`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });
        const data = await response.json();
        console.log("thông tin thêm:  ", data[0].thongTinThem)
        return data;
    } catch (error) {
        console.log(error)
    }

}