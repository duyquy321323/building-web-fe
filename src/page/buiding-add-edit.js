import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Snackbar, styled, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from '../api';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const BuildingAddEdit = ({ name }) => {

    const [buildingAdd, setBuildingAdd] = useState({
        name: "",
        street: "",
        ward: "",
        district: null,
        structure: "",
        numberOfBasement: null,
        floorArea: null,
        direction: "",
        level: "",
        rentArea: "",
        rentPrice: null,
        rentPriceDescription: "",
        serviceFee: null,
        carFee: null,
        motorFee: null,
        waterFee: null,
        overtimeFee: null,
        electricity: null,
        deposit: null,
        payment: null,
        rentTime: null,
        decorationTime: null,
        managerName: "",
        managerPhoneNumber: "",
        brokerageFee: null,
        rentTypes: [],
        note: "",
        linkOfBuilding: null
    });

    const [districts, setDistricts] = useState([]);
    const fetchDistricts = async () => {
        try {
            const response = await api.get('/util/district-code');
            const districtArray = Object.keys(response.data).map(key => ({
                id: key,
                name: response.data[key]
            }));
            console.log(districtArray);

            setDistricts(districtArray);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    const [rentTypes, setRentTypes] = useState([]);
    const fetchRentTypes = async () => {
        try {
            const response = await api.get('/util/rent-type-code');
            const rentTypeArray = Object.keys(response.data).map(key => ({
                id: key,
                name: response.data[key]
            }));
            console.log(rentTypeArray);

            setRentTypes(rentTypeArray);
        } catch (error) {
            console.error("Error fetching rent types:", error);
        }
    };

    useEffect(() => {
        fetchRentTypes();
    }, []);

    const handleAddBuilding = async () => {
        try {
            const formData = new FormData();
            if (buildingAdd) {
                Object.keys(buildingAdd).forEach(key => {
                    if (buildingAdd[key] !== undefined && buildingAdd[key] !== null) {
                        formData.append(key, buildingAdd[key]);
                    }
                });

                // Thêm dữ liệu tập tin từ phần tử đầu vào HTML
                const fileInput = document.querySelector('input[name="linkOfBuilding"]');
                if (fileInput && fileInput.files.length > 0) {
                    formData.append('linkOfBuilding', fileInput.files[0]);
                } else {
                    console.error('No file selected');
                }
                const isAdd = name.includes("Thêm");
                let response = null;
                if (isAdd) {
                    response = await api.post(`/buildings/new`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Đảm bảo đúng kiểu dữ liệu cho tải lên tập tin
                        },
                    });
                } else {
                    const id = sessionStorage.getItem("idBuilding");
                    response = await api.put(`/buildings/?id=${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    sessionStorage.removeItem("idBuilding");
                }
                if (response.status === 201 || response.status === 200) {
                    setOpen(true);
                    setContent(name + " thành công");
                }
            }
        } catch (error) {
            setOpen(true);
            if (error.response && error.response.status === 400) {
                setContent("Yêu cầu không hợp lệ.");
            } else {
                setContent("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
            console.error('Error logging in:', error);
        }
    };

    const [open, setOpen] = React.useState(false);
    const [content, setContent] = React.useState("");


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            // Xử lý khi là Checkbox
            if (checked) {
                setBuildingAdd(prevState => ({
                    ...prevState,
                    rentTypes: [...prevState.rentTypes, value]
                }));
            } else {
                setBuildingAdd(prevState => ({
                    ...prevState,
                    rentTypes: prevState.rentTypes.filter(id => id !== value)
                }));
            }
        } else {
            // Xử lý khi là Select hoặc các trường input khác
            setBuildingAdd(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    return (
        <>
            <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', margin: '0 auto', gap: '30px' }}>
                <Typography color='rgb(25, 118, 210)' fontWeight={'900'} lineHeight={3} >{name}</Typography>
                <TextField
                    id="name"
                    name="name"
                    label="Tên tòa nhà"
                    variant="outlined"
                    value={buildingAdd.name}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="street"
                    name="street"
                    label="Đường"
                    variant="outlined"
                    value={buildingAdd.street}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="ward"
                    name="ward"
                    label="Phường"
                    variant="outlined"
                    value={buildingAdd.ward}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <FormControl fullWidth size='small'>
                    <InputLabel id="demo-simple-select-label">---Chọn Quận---</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="district"
                        value={buildingAdd.district}
                        label="---Chọn Quận---"
                        onChange={handleChange}
                    >
                        {districts.map((district) =>
                            <MenuItem value={district.id}>{district.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <TextField
                    id="structure"
                    name="structure"
                    label="Cấu tạo"
                    variant="outlined"
                    value={buildingAdd.structure}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="numberOfBasement"
                    name="numberOfBasement"
                    label="Số tầng hầm"
                    variant="outlined"
                    value={buildingAdd.numberOfBasement}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="floorArea"
                    name="floorArea"
                    label="Diện tích sàn"
                    variant="outlined"
                    value={buildingAdd.floorArea}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="direction"
                    name="direction"
                    label="Hướng"
                    variant="outlined"
                    value={buildingAdd.direction}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="level"
                    name="level"
                    label="Hạng"
                    variant="outlined"
                    value={buildingAdd.level}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="rentArea"
                    name="rentArea"
                    label="Diện tích thuê"
                    variant="outlined"
                    value={buildingAdd.rentArea}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="rentPrice"
                    name="rentPrice"
                    label="Giá thuê"
                    variant="outlined"
                    value={buildingAdd.rentPrice}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="rentPriceDescription"
                    name="rentPriceDescription"
                    label="Chi tiết giá thuê"
                    variant="outlined"
                    value={buildingAdd.rentPriceDescription}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="serviceFee"
                    name="serviceFee"
                    label="Phí dịch vụ"
                    variant="outlined"
                    value={buildingAdd.serviceFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="carFee"
                    name="carFee"
                    label="Phí ô tô"
                    variant="outlined"
                    value={buildingAdd.carFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="motorFee"
                    name="motorFee"
                    label="Phí mô tô"
                    variant="outlined"
                    value={buildingAdd.motorFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="waterFee"
                    name="waterFee"
                    label="Tiền nước"
                    variant="outlined"
                    value={buildingAdd.waterFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="overtimeFee"
                    name="overtimeFee"
                    label="Phí ngoài giờ"
                    variant="outlined"
                    value={buildingAdd.overtimeFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="electricity"
                    name="electricity"
                    label="Tiền điện"
                    variant="outlined"
                    value={buildingAdd.electricity}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="deposit"
                    name="deposit"
                    label="Tiền cọc"
                    variant="outlined"
                    value={buildingAdd.deposit}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="payment"
                    name="payment"
                    label="Tiền phải thanh toán"
                    variant="outlined"
                    value={buildingAdd.payment}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="rentTime"
                    name="rentTime"
                    label="Thời gian thuê"
                    variant="outlined"
                    value={buildingAdd.rentTime}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="decorationTime"
                    name="decorationTime"
                    label="Thời gian trang trí"
                    variant="outlined"
                    value={buildingAdd.decorationTime}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="managerName"
                    name="managerName"
                    label="Tên quản lý"
                    variant="outlined"
                    value={buildingAdd.managerName}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="managerPhoneNumber"
                    name="managerPhoneNumber"
                    label="Số điện thoại quản lý"
                    variant="outlined"
                    value={buildingAdd.managerPhoneNumber}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="brokerageFee"
                    name="brokerageFee"
                    label="Phí môi giới"
                    variant="outlined"
                    value={buildingAdd.brokerageFee}
                    onChange={handleChange}
                    size='small'
                    type="number"
                    fullWidth
                />
                <TextField
                    id="note"
                    name="note"
                    label="Ghi chú"
                    variant="outlined"
                    value={buildingAdd.note}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <Box>
                    <Typography color='rgba(0, 0, 0, 0.6)' fontWeight='bold'>Loại tòa nhà </Typography>
                    {rentTypes.map((rentType) =>
                        <FormControlLabel control={<Checkbox />} value={rentType.id} onChange={handleChange} label={rentType.name} />
                    )
                    }
                </Box>
                <Box>
                    <Typography color='rgba(0, 0, 0, 0.6)' fontWeight='bold'>Ảnh tòa nhà </Typography>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{
                            maxWidth: '200px'
                        }}
                    >
                        Tải ảnh lên
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleChange}
                            name="linkOfBuilding"
                            id="linkOfBuilding" />
                    </Button>
                </Box>
                <Button sx={{ height: '50px' }} variant="contained" startIcon={<DomainAddIcon style={{ fontSize: '40px' }} />} onClick={handleAddBuilding}>
                    Thêm
                </Button>
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

export default BuildingAddEdit;