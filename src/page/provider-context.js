// // AuthContext.js
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const expiry = localStorage.getItem('tokenExpiry');

//         if (token && expiry && new Date().getTime() < expiry) {
//             setIsAuthenticated(true);
//         } else {
//             setIsAuthenticated(false);
//             navigate('/account/login');
//         }
//     }, [navigate]);

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);