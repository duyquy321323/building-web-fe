import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useSnackbar } from "./snackbarcontext";

const CreateAccount = () => {

    const [editAccount, setEditAccount] = useState({
        fullname: "",
        roles: []
    });

    const navigate = useNavigate();

    const handleCloseEdit = () => {
        sessionStorage.removeItem("accountUsername");
        navigate("/admin/account");
    }

    const [roles, setRoles] = useState([]);
    const fetchRoles = async () => {
        try {
            const response = await api.get('/util/role-code');
            const roleArray = Object.keys(response.data).map(key => ({
                id: key,
                name: response.data[key]
            }));
            setRoles(roleArray);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);
    const { showSnackbar } = useSnackbar();
    const handleEditAccount = async () => {
        try {
            const response = await api.put(`/admin/account?username=${sessionStorage.getItem('accountUsername')}&fullname=${editAccount.fullname}&roles=${editAccount.roles.join(',')}`);
            if (response.status === 200) {
                handleCloseEdit();
                showSnackbar("Cập nhật thành công.");
            }
            else {
                showSnackbar("Yêu cầu không hợp lệ.");
            }
        } catch (error) {
            showSnackbar("Yêu cầu không hợp lệ.");
            console.error('Error patch in:', error);
        }
    };
    const handleResetPassword = async () => {
        try {
            const response = await api.put(`/admin/password?username=${sessionStorage.getItem('accountUsername')}`);
            if (response.status === 200) {
                handleCloseEdit();
                showSnackbar("Đặt lại mật khẩu thành công. Mật khẩu là 321323.");
            }
            else {
                showSnackbar("Yêu cầu không hợp lệ.");
            }
        } catch (error) {
            showSnackbar("Yêu cầu không hợp lệ.");
            console.error('Error patch in:', error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditAccount((prev) => ({
            ...prev,
            [name]: name === "roles" ? [value] : value
        }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '50%', gap: '30px', margin: '30px auto' }}>
            <Typography color='rgb(25, 118, 210)' fontWeight={'900'} lineHeight={3} >Thông tin tài khoản</Typography>
            <Box>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Họ và tên"
                    variant="outlined"
                    value={editAccount.fullname}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
            </Box>
            <Box>
                <FormControl fullWidth size='small'>
                    <InputLabel id="demo-simple-select-label">---Chọn vai trò---</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="roles"
                        value={editAccount.roles}
                        label="---Chọn vai trò---"
                        onChange={handleChange}
                    >
                        {roles.map((role) =>
                            <MenuItem value={role.id}>{role.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            </Box>
            <Grid container justifyContent={'space-between'}>
                <Grid item xs={5.75}>
                    <Button fullWidth variant="outlined" onClick={handleCloseEdit} size='small'>
                        Hủy thao tác
                    </Button>
                </Grid>
                <Grid item xs={5.75}>
                    <Button fullWidth variant="contained" onClick={handleEditAccount} size='small'>
                        Cập nhật thông tin
                    </Button>
                </Grid>
            </Grid>
            <Button fullWidth variant="text" title="Đặt lại mật khẩu của tài khoản đang sửa về lại 321323" onClick={handleResetPassword} size='small'>
                Đặt lại mật khẩu
            </Button>
        </Box>
    );
}

export default CreateAccount;