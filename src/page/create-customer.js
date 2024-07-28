import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useSnackbar } from "./snackbarcontext";

const CreateCustomer = () => {
    const [createCustomer, setCreateCustomer] = useState({
        fullname: "",
        phone: "",
        email: "",
        nameCompany: "",
        demand: ""
    });

    const [errors, setErrors] = useState({
        fullname: false,
        phone: false,
        demand: false
    });


    const [statusRq, setStatusRq] = useState(null);

    const navigate = useNavigate();

    const handleCloseCreate = () => {
        sessionStorage.removeItem("idCustomer");
        navigate("/customer/");
    }

    const [status, setStatus] = useState([]);
    const fetchStatus = async () => {
        try {
            const response = await api.get('/util/status-code');
            const statusArray = Object.keys(response.data).map(key => ({
                id: key,
                name: response.data[key]
            }));
            setStatus(statusArray);
        } catch (error) {
            console.error("Error fetching status:", error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const { showSnackbar } = useSnackbar();

    const handleCreateCustomer = async () => {
        if (!createCustomer.fullname.trim() || !createCustomer.phone.trim() || !createCustomer.demand.trim()) {
            setErrors({
                fullname: !createCustomer.fullname.trim(),
                phone: !createCustomer.phone.trim(),
                demand: !createCustomer.demand.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        try {
            const response = await api.post(`/admin/customer?status=${statusRq}`, createCustomer);
            if (response.status === 201) {
                handleCloseCreate();
                showSnackbar("Thêm thành công.");
            }
            else {
                showSnackbar("Yêu cầu không hợp lệ.")
            }
        } catch (error) {
            showSnackbar("Yêu cầu không hợp lệ.")
            console.error('Error patch in:', error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCreateCustomer((prev) => ({
            ...prev,
            [name]: value
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

    const handleStatus = (e) => {
        setStatusRq(e.target.value);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '50%', gap: '30px', margin: '30px auto' }}>
            <Typography color='rgb(25, 118, 210)' fontWeight={'900'} lineHeight={3} >Thông tin khách hàng</Typography>
            <Box>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Tên khách hàng"
                    variant="outlined"
                    value={createCustomer.fullname}
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
                <TextField
                    id="phone"
                    name="phone"
                    label="Số điện thoại"
                    variant="outlined"
                    value={createCustomer.phone}
                    onChange={handleChange}
                    size='small'
                    onBlur={handleBlur}
                    error={errors.phone}
                    helperText={errors.phone ? "Số điện thoại là bắt buộc" : ""}
                    required
                    fullWidth
                />
            </Box>
            <Box>
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={createCustomer.email}
                    type="email"
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
            </Box>
            <Box>
                <TextField
                    id="nameCompany"
                    name="nameCompany"
                    label="Tên công ty"
                    variant="outlined"
                    value={createCustomer.nameCompany}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
            </Box>
            <Box>
                <TextField
                    id="demand"
                    name="demand"
                    label="Nhu cầu"
                    variant="outlined"
                    value={createCustomer.demand}
                    onChange={handleChange}
                    size='small'
                    onBlur={handleBlur}
                    error={errors.demand}
                    helperText={errors.demand ? "Nội dung là bắt buộc" : ""}
                    required
                    fullWidth
                />
            </Box>
            <Box>
                <FormControl fullWidth size='small'>
                    <InputLabel id="demo-simple-select-label">---Trạng thái---</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="status"
                        value={statusRq}
                        label="---Trạng thái---"
                        onChange={handleStatus}
                    >
                        {status.map((st) =>
                            <MenuItem value={st.id}>{st.name}</MenuItem>)
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
                    <Button fullWidth variant="contained" onClick={handleCreateCustomer} size='small'>
                        Thêm khách hàng
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CreateCustomer;