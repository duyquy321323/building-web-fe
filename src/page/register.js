import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../api';

const Register = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullname: "",
        email: "",
        phoneNumber: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState("");
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log(userInfo);
        setOpen(true);
        try {
            const res = await api.post("/account/register", userInfo);
            console.log(res);
            // Kiểm tra nếu request thành công
            if (res.status === 201) {
                console.log(res);
                setContent("Tạo tài khoản thành công")
                navigate("/account/login");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error:", error);
            setContent("Tạo tài khoản thất bại!")
        }
    };

    return (
        <>
            <Box sx={
                {
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '25%',
                    margin: '100px auto',
                    fontSize: '40px',
                    color: 'rgb(25, 118, 210)',
                    fontWeight: '900'
                }
            }>
                <label>Đăng ký tài khoản</label>
                <TextField
                    id="username"
                    name="username"
                    label="Tên đăng nhập"
                    variant="outlined"
                    value={userInfo.username}
                    onChange={handleChange}
                    fullWidth
                />
                <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="password"
                        name="password"
                        value={userInfo.password}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Mật khẩu"
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-confirm-password">Nhập lại mật khẩu</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userInfo.confirmPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownConfirmPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Nhập lại mật khẩu"
                        onChange={handleChange}
                    />
                </FormControl>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Họ và tên"
                    variant="outlined"
                    value={userInfo.fullName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={userInfo.email}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Số điện thoại"
                    variant="outlined"
                    value={userInfo.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSubmit} fullWidth>Đăng ký</Button>
                <Typography color={'CaptionText'}>Bạn đã có tài khoản? <Link to="/account/login">Đăng nhập</Link></Typography>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={content}
            />
        </>
    );
}

export default Register;