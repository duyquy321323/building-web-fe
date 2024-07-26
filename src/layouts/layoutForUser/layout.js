import ApartmentIcon from '@mui/icons-material/Apartment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Avatar, Button, Menu, MenuItem, Snackbar, Tooltip } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import api from '../../api';
import { logout } from '../../redux/actions';
import Footer from '../footer';

const drawerWidth = 240;

const ContentContainer = styled('div')({
    minHeight: '680px',
    flex: '1',
    paddingBottom: '100px'
});

const FooterContainer = styled('div')({
    minHeight: '200px'
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function LayoutForUser({ name, isLoggedIn }) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const dispatch = useDispatch();
    const [userData, setUserData] = React.useState({
        id: "",
        token: "",
        expiryTime: "",
        roles: []
    })

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
            setOpenSetting(true);
            // Gửi yêu cầu POST tới API /account/logout
            const response = await api.post('/account/logout');
            if (response.status === 200) {
                // Xóa token và expiryTime từ localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('expiryTime');
                setAnchorElUser(null);
                dispatch(logout());
                setContent("Đăng xuất thành công!");
                // Chuyển hướng người dùng đến trang đăng nhập
                navigate('/account/login');
            }
        } catch (error) {
            setContent("Đăng xuất thất bại. Hãy đăng nhập trước!");
            console.error("Error khi logout:", error);
        }
    };

    const [openSetting, setOpenSetting] = React.useState(false);
    const [content, setContent] = React.useState("");


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSetting(false);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClick = (e) => {
        navigate(e);
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {name}
                        </Typography>
                        <Box sx={{ flexGrow: 0, marginLeft: 'auto', display: 'flex' }}>
                            <Button
                                key={"Đăng nhập"}
                                onClick={() => handleClick("/home")}
                                sx={{ my: 2, color: 'white', display: 'block', marginRight: '20px' }}
                            >
                                Trang chủ
                            </Button>
                            <Tooltip title="Mở cài đặt">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Quản lý tòa nhà', 'Quản lý khách hàng'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={() => index % 2 === 0 ? navigate("/buildings/search") : navigate("/customer/")}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <ApartmentIcon /> : <SupportAgentIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['Quản lý tài khoản'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={() => navigate("/admin/account")}>
                                    <ListItemIcon>
                                        <ManageAccountsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                </Drawer>
                <Main open={open}>
                    <DrawerHeader />
                    <ContentContainer>
                        <Outlet />
                    </ContentContainer>
                    <Snackbar
                        open={openSetting}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={content}
                    />
                </Main>

            </Box>
            <FooterContainer>
                <Footer />
            </FooterContainer>
        </>
    );
}