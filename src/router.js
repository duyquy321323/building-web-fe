import { useSelector } from 'react-redux';
import { Navigate, useRoutes } from "react-router-dom";
import Layout from './layouts/layout';
import LayoutForUser from './layouts/layoutForUser/layout';
import BuildingAddEdit from './page/buiding-add-edit';
import BuildingSearch from './page/buiding-search';
import Contact from './page/contact';
import EditAccount from './page/edit-account';
import Home from './page/home';
import Introduction from './page/introduction';
import Login from './page/login';
import ManagerAccount from './page/manager-account';
import ManagerCustomer from './page/manager-customer';
import News from './page/news';
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
                { index: true, element: <BuildingAddEdit name={'Thêm tòa nhà'} /> },
            ],
        },
        {
            path: "/buildings/edit",
            element: isLoggedIn ? (isAdmin || isStaff ? <LayoutForUser name={"Quản lý tòa nhà"} isLoggedIn={isLoggedIn} /> : <Unauthorized />) : <Navigate to={'/account/login'}></Navigate>,
            children: [
                { index: true, element: <BuildingAddEdit name={'Sửa tòa nhà'} /> },
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
    ]);

    return routes;
}
///