import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Danh sách các trang không yêu cầu đăng nhập
const noAuthPages = ['/account/login', '/account/register', '/account/logout'];

// Check token expiration on page load
window.addEventListener('load', () => {
  const expiryTime = localStorage.getItem('expiryTime');
  const currentTime = new Date().getTime();
  const currentPath = window.location.pathname;

  if (expiryTime && currentTime >= expiryTime) {
    console.log("Token đã hết hạn. Đang xóa token...");
    localStorage.removeItem('token');
    localStorage.removeItem('expiryTime');
    // Kiểm tra xem trang hiện tại có trong danh sách không yêu cầu đăng nhập
    if (!noAuthPages.includes(currentPath)) {
      // Chuyển hướng người dùng đến trang đăng nhập nếu trang hiện tại không trong danh sách
      window.location.href = '/account/login';
    }
  }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
