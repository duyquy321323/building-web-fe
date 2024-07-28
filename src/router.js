import { useSelector } from 'react-redux';
import { Navigate, useRoutes } from "react-router-dom";
import Layout from './layouts/layout';
import LayoutForUser from './layouts/layoutForUser/layout';
import CreateAccount from './page/admin-new-account';
import BuildingAdd from './page/buiding-add';
import BuildingSearch from './page/buiding-search';
import BuildingEdit from './page/building-edit';
import Contact from './page/contact';
import CreateCustomer from './page/create-customer';
import EditAccount from './page/edit-account';
import EditCustomer from './page/edit-customer';
import Home from './page/home';
import Introduction from './page/introduction';
import Login from './page/login';
import ManagerAccount from './page/manager-account';
import ManagerCustomer from './page/manager-customer';
import News from './page/news';
import Profile from './page/profile';
import RealEstateProject from './page/real-estate-project';
import Register from './page/register';
import Unauthorized from './page/unauthentication';
export default function Router() {
    const userData = useSelector(state => {
        if (state.auth.userData) {
            console.log(state.auth.userData)
            return state.auth.userData;
        }
        return null; // hoặc giá trị mặc định phù hợp với ứng dụng của bạn
    });

    const isLoggedIn = !!userData;
    const isStaff = isLoggedIn && userData.roles.includes("STAFF")
    const isAdmin = isLoggedIn && userData.roles.includes("MANAGER");

    const routes = useRoutes([
        {
            path: '/*',
            element: isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/account/login" />
        },
        {
            path: "/account/register",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <Register /> },
            ],
        },
        {
            path: "/account/login",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <Login /> },
            ],
        },
        {
            path: "/contact",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <Contact /> },
            ],
        },
        {
            path: "/home",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <Home /> },
            ],
        },
        {
            path: "/introduction",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <Introduction /> },
            ],
        },
        {
            path: "/news",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <News /> },
            ],
        },
        {
            path: "/real-estate-project",
            element: <Layout isLoggedIn={isLoggedIn} />,
            children: [
                { index: true, element: <RealEstateProject /> },
            ],
        },
        {
            path: "/profile",
            element: isLoggedIn ? <LayoutForUser name={"Thông tin tài khoản"} /> : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <Profile userData={userData} /> },
            ],
        },
        {
            path: "/buildings/search",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý tòa nhà"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <BuildingSearch /> },
            ],
        },
        {
            path: "/buildings/new",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý tòa nhà"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <BuildingAdd name={'Thêm tòa nhà'} /> },
            ],
        },
        {
            path: "/buildings/edit",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý tòa nhà"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <BuildingEdit name={'Cập nhật tòa nhà'} /> },
            ],
        },
        {
            path: "/customer/",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý khách hàng"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <ManagerCustomer /> },
            ],
        },
        {
            path: "/customer/edit",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý khách hàng"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <EditCustomer /> },
            ],
        },
        {
            path: "/customer/new",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý khách hàng"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <CreateCustomer /> },
            ],
        },
        {
            path: "/admin/account",
            element: isLoggedIn ? (isAdmin ? <LayoutForUser name={"Quản lý tài khoản"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <ManagerAccount /> },
            ],
        },
        {
            path: "/admin/account-edit",
            element: isLoggedIn ? (isAdmin ? <LayoutForUser name={"Quản lý tài khoản"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <EditAccount /> },
            ],
        },
        {
            path: "/admin/account-new",
            element: isLoggedIn ? (isAdmin ? <LayoutForUser name={"Quản lý tài khoản"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <CreateAccount /> },
            ],
        },
    ]);

    return routes;
}
///