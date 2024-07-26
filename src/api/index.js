import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8081',
    withCredentials: true,
});

// Interceptor để kiểm tra token trước khi gửi request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('expiryTime');

        if (token && expiryTime) {
            const now = new Date().getTime();
            if (now < expiryTime) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.log("Token đã hết hạn. Đang xóa token...");
                // Xóa token nếu đã hết hạn
                localStorage.removeItem('token');
                localStorage.removeItem('expiryTime');
                // Chuyển hướng người dùng đến trang đăng nhập
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;