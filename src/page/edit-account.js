import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";

const EditAccount = () => {

    const [editAccount, setEditAccount] = useState({
        fullname: "",
        roles: []
    });

    const navigate = useNavigate();

    const handleCloseEdit = () => {
        sessionStorage.removeItem("accountUsername");
        navigate("/admin/account");
    }

    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState("");


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

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

    const handleEditAccount = async () => {
        setOpen(true);
        try {
            const response = await api.put(`/admin/account?username=${sessionStorage.getItem('accountUsername')}&fullname=${editAccount.fullname}&roles=${editAccount.roles.join(',')}`);
            if (response.status === 200) {
                handleCloseEdit();
                setContent("Cập nhật thành công.")
            }
            else {
                setContent("Yêu cầu không hợp lệ.")
            }
        } catch (error) {
            setContent("Yêu cầu không hợp lệ.")
            console.error('Error patch in:', error);
        }
    };
    const handleResetPassword = async () => {
        setOpen(true);
        try {
            const response = await api.put(`/admin/password?username=${sessionStorage.getItem('accountUsername')}`);
            if (response.status === 200) {
                handleCloseEdit();
                setContent("Đặt lại mật khẩu thành công. Mật khẩu là 321323.")
            }
            else {
                setContent("Yêu cầu không hợp lệ.")
            }
        } catch (error) {
            setContent("Yêu cầu không hợp lệ.")
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
                        Sửa
                    </Button>
                </Grid>
            </Grid>
            <Button fullWidth variant="text" title="Đặt lại mật khẩu của tài khoản đang sửa về lại 321323" onClick={handleResetPassword} size='small'>
                Đặt lại mật khẩu
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={content}
            />
        </Box>
    );
}

export default EditAccount;