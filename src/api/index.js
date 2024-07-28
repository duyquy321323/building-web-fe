import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8081',
    withCredentials: true,
});

const pathNoLogin = ['/account/login', '/account/register', '/home', '/contact', '/introduction', '/news', '/real-estate-project'];

// Interceptor để kiểm tra token trước khi gửi request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const expiryTime = localStorage.getItem('expiryTime');
        const rememberMeCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('remember-me='));
        const currentPath = window.location.pathname;
        const now = new Date().getTime();

        // Nếu token hoặc remember-me cookie tồn tại và còn hạn
        if ((token && expiryTime && now < expiryTime) || rememberMeCookie) {
            if (token && now < expiryTime) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } else {
            console.log("Token đã hết hạn hoặc không có token. Đang xóa token...");
            // Xóa token và expiryTime nếu đã hết hạn
            localStorage.removeItem('token');
            localStorage.removeItem('expiryTime');

            if (!rememberMeCookie) {
                localStorage.removeItem('reduxState');
                // Chuyển hướng người dùng đến trang đăng nhập nếu không đang ở trang đăng nhập
                if (!pathNoLogin.includes(currentPath)) {
                    window.location.href = '/account/login';
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
