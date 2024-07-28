import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { useSnackbar } from "./snackbarcontext";

const CreateAccount = () => {
    const [createAccount, setCreateAccount] = useState({
        username: "",
        fullname: "",
        roles: []
    });

    const [errors, setErrors] = useState({
        username: false,
        fullname: false
    });

    const navigate = useNavigate();

    const handleCloseCreate = () => {
        navigate("/admin/account");
    }

    const { showSnackbar } = useSnackbar();

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

    const handleCreateAccount = async () => {
        if (!createAccount.fullname.trim() || !createAccount.username.trim()) {
            setErrors({
                fullname: !createAccount.fullname.trim(),
                username: !createAccount.username.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        try {
            const response = await api.post(`/admin/account`, createAccount);
            if (response.status === 201) {
                handleCloseCreate();
                showSnackbar("Tạo tài khoản thành công.");
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
        setCreateAccount((prev) => ({
            ...prev,
            [name]: name === "roles" ? [value] : value
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '50%', gap: '30px', margin: '30px auto' }}>
            <Typography color='rgb(25, 118, 210)' fontWeight={'900'} lineHeight={3} >Tạo tài khoản</Typography>
            <Box>
                <TextField
                    id="username"
                    name="username"
                    label="Tên tài khoản"
                    variant="outlined"
                    value={createAccount.username}
                    onChange={handleChange}
                    size='small'
                    onBlur={handleBlur}
                    error={errors.username}
                    helperText={errors.username ? "Tên tài khoản là bắt buộc" : ""}
                    required
                    fullWidth
                />
            </Box>
            <Box>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Họ và tên"
                    variant="outlined"
                    value={createAccount.fullname}
                    onChange={handleChange}
                    size='small'
                    onBlur={handleBlur}
                    error={errors.fullname}
                    helperText={errors.fullname ? "Tên là bắt buộc" : ""}
                    required
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
                        value={createAccount.roles}
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
                    <Button fullWidth variant="outlined" onClick={handleCloseCreate} size='small'>
                        Hủy thao tác
                    </Button>
                </Grid>
                <Grid item xs={5.75}>
                    <Button fullWidth variant="contained" onClick={handleCreateAccount} size='small'>
                        Tạo tài khoản
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CreateAccount;