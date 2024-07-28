import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from '../api';
import { loginSuccess } from "../redux/actions";
import { useSnackbar } from "./snackbarcontext";

const Login = () => {

    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = useState(false); // State để theo dõi checkbox
    const dispatch = useDispatch();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false
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

    const handleCheckboxChange = (event) => {
        setRememberMe(event.target.checked);
    };

    const navigate = useNavigate();

    const { showSnackbar } = useSnackbar();
    const handleLogin = async () => {
        if (!userInfo.username.trim() || !userInfo.password.trim()) {
            setErrors({
                username: !userInfo.username.trim(),
                password: !userInfo.password.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        try {
            const response = await api.post(`/account/login?remember-me=${rememberMe}`, userInfo);
            console.log(response.data);
            if (response && response.data.token) {
                if (!localStorage.getItem('token')) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("expiryTime", response.data.expiryTime);
                }
                const userData = response.data;
                dispatch(loginSuccess(userData));
                showSnackbar("Đăng nhập thành công!");
                navigate("/home")
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showSnackbar("Tên đăng nhập hoặc mật khẩu không đúng.");
            } else {
                showSnackbar("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
            console.error('Error logging in:', error);
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
                <label>Đăng nhập</label>
                <TextField
                    id="username"
                    name="username"
                    label="Tên đăng nhập"
                    variant="outlined"
                    value={userInfo.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.username}
                    helperText={errors.username ? "Tên đăng nhập là bắt buộc" : ""}
                    required
                    fullWidth
                />
                <FormControl sx={{ width: '100%' }} variant="outlined" error={errors.password} required>
                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="password"
                        name="password"
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
                        value={userInfo.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.password && <Typography variant="caption" color="error">Mật khẩu là bắt buộc</Typography>}
                </FormControl>
                <FormControlLabel
                    value="true"
                    control={<Checkbox checked={rememberMe} onChange={handleCheckboxChange} size="small" />}
                    label="Ghi nhớ lần đăng nhập này"
                    labelPlacement="end"
                    sx={{
                        alignSelf: 'flex-start', color: 'rgba(0, 0, 0, 0.6)'
                    }}
                    name="remember-me"
                />
                <Button variant="contained" onClick={handleLogin} fullWidth>Đăng nhập</Button>
                <Typography color={'CaptionText'}>Bạn chưa có tài khoản? <Link to="/account/register">Đăng ký</Link></Typography>
            </Box>
        </>
    );
}

export default Login;