import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../api';
import { useSnackbar } from "./snackbarcontext";

const Register = () => {
    const [showPassword, setShowPassword] = React.useState(false);

    const { showSnackbar } = useSnackbar();

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

    const [errors, setErrors] = useState({
        username: false,
        password: false,
        fullname: false,
        phoneNumber: false
    });


    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (value.trim() !== "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: false,
            }));
        }
    };

    const handleBlur = (event) => {
        const { name, value } = event.target;
        if (value.trim() === "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: true,
            }));
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!userInfo.username.trim() || !userInfo.password.trim() || !userInfo.fullname.trim() || !userInfo.phoneNumber.trim()) {
            setErrors({
                username: !userInfo.username.trim(),
                password: !userInfo.password.trim(),
                fullname: !userInfo.fullname.trim(),
                phoneNumber: !userInfo.phoneNumber.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        console.log(userInfo);
        try {
            const res = await api.post("/account/register", userInfo);
            console.log(res);
            // Kiểm tra nếu request thành công
            if (res.status === 201) {
                console.log(res);
                showSnackbar('Tạo tài khoản thành công');
                navigate("/account/login");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error:", error);
            showSnackbar('Tạo tài khoản thất bại')
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
                    onBlur={handleBlur}
                    error={errors.username}
                    helperText={errors.username ? "Tên đăng nhập là bắt buộc" : ""}
                    required
                />
                <FormControl sx={{ width: '100%' }} variant="outlined" error={errors.password} required>
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
                        onBlur={handleBlur}
                    />
                    {errors.password && <Typography variant="caption" color="error">Mật khẩu là bắt buộc</Typography>}
                </FormControl>
                <FormControl sx={{ width: '100%' }} variant="outlined" error={errors.password} required>
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
                        onBlur={handleBlur}
                    />
                    {errors.password && <Typography variant="caption" color="error">Mật khẩu là bắt buộc</Typography>}
                </FormControl>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Họ và tên"
                    variant="outlined"
                    value={userInfo.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.fullname}
                    helperText={errors.fullname ? "Họ và tên là bắt buộc" : ""}
                    required
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
                    onBlur={handleBlur}
                    error={errors.phoneNumber}
                    helperText={errors.phoneNumber ? "Số điện thoại là bắt buộc" : ""}
                    required
                    fullWidth
                />
                <Button variant="contained" onClick={handleSubmit} fullWidth>Đăng ký</Button>
                <Typography color={'CaptionText'}>Bạn đã có tài khoản? <Link to="/account/login">Đăng nhập</Link></Typography>
            </Box>
        </>
    );
}

export default Register;