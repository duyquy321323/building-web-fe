import AdbIcon from '@mui/icons-material/Adb';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSnackbar } from '../page/snackbarcontext';
import { logout } from '../redux/actions';

function Header({ isLoggedIn }) {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const dispatch = useDispatch();
    const [userData, setUserData] = React.useState({
        id: "",
        token: "",
        expiryTime: "",
        roles: []
    })

    const { showSnackbar } = useSnackbar();

    const userDataFromStore = useSelector(state => state.auth.userData);
    React.useEffect(() => {
        if (userDataFromStore) {
            setUserData(userDataFromStore);
        }
    }, [userDataFromStore]);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    console.log(isLoggedIn);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Gửi yêu cầu POST tới API /account/logout
            const response = await api.post('/account/logout');
            if (response.status === 200) {
                // Xóa token và expiryTime từ localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('expiryTime');
                setAnchorElUser(null);
                dispatch(logout())
                showSnackbar("Đăng xuất thành công!");
                // Chuyển hướng người dùng đến trang đăng nhập
                navigate('/account/login');
            }
        } catch (error) {
            showSnackbar("Đăng xuất thất bại. Hãy đăng nhập trước!");
            console.error("Error khi logout:", error);
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClick = (e) => {
        navigate(e);
    }

    return (
        <AppBar position="static">
            <Container maxWidth="100%">
                <Toolbar disableGutters>
                    <ApartmentIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Building Web
                    </Typography>


                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/* {pages.map((page) => ( */}
                        <Button
                            key={"Trang chủ"}
                            onClick={() => handleClick("/home")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Trang chủ
                        </Button>
                        <Button
                            key={"Giới thiệu"}
                            onClick={() => handleClick("/introduction")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Giới thiệu
                        </Button>
                        <Button
                            key={"Dự án bất động sản"}
                            onClick={() => handleClick("/real-estate-project")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Dự án bất động sản
                        </Button>
                        <Button
                            key={"Tin tức"}
                            onClick={() => handleClick("/news")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Tin tức
                        </Button>
                        <Button
                            key={"Liên hệ"}
                            onClick={() => handleClick("/contact")}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Liên hệ
                        </Button>
                        {/* ))} */}
                    </Box>

                    {
                        isLoggedIn ? (userData.roles.map(role => (role === 'MANAGER' || role === 'STAFF') ?
                            <Box sx={{ marginRight: '20px' }}>
                                <Button
                                    key={"Trang quản trị"}
                                    onClick={() => handleClick("/buildings/search")}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Trang quản trị
                                </Button>
                            </Box> : <></>)) : <Box sx={{ marginRight: '20px' }}>
                            <Button
                                key={"Đăng nhập"}
                                onClick={() => handleClick("/account/login")}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    }
                    {isLoggedIn ?
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Mở cài đặt">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={`data:image/jpeg;base64,${userData.avatar}`} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {/* {settings.map((setting) => ( */}
                                <MenuItem key={'Thông tin của bạn'} onClick={() => handleClick("/profile")}>
                                    <Typography textAlign="center">{"Thông tin của bạn"}</Typography>
                                </MenuItem>
                                <MenuItem key={'Đăng xuất'} onClick={handleLogout}>
                                    <Typography textAlign="center">{"Đăng xuất"}</Typography>
                                </MenuItem>
                                {/* ))} */}
                            </Menu>
                        </Box> : <></>
                    }
                </Toolbar>
            </Container>
        </AppBar >
    );
}
export default Header;