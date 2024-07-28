import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from '../api';
import CardBuilding from "./cardbuilding";
import { useSnackbar } from './snackbarcontext';

const RealEstateProject = () => {

    const [buildingSearch, setBuildingSearch] = useState({
        name: "",
        floorArea: null,
        district: null,
        ward: "",
        street: "",
        numberOfBasement: null,
        direction: "",
        level: "",
        areaFrom: null,
        areaTo: null,
        rentPriceFrom: null,
        rentPriceTo: null,
        managerName: "",
        managerPhoneNumber: "",
        userId: null,
        rentTypes: []
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

    const { showSnackbar } = useSnackbar();

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

    const [buidingData, setBuildingData] = useState([]);
    const handleGetBuilding = async () => {
        try {
            console.log(buildingSearch);
            const response = await api.post(`/buildings/search`, buildingSearch);
            console.log(response.data);
            if (response && response.data) {
                setBuildingData(response.data.content);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showSnackbar("Yêu cầu không hợp lệ.");
            } else {
                showSnackbar("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
            console.error('Error logging in:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type === 'checkbox') {
            // Xử lý khi là Checkbox
            if (checked) {
                setBuildingSearch(prevState => ({
                    ...prevState,
                    rentTypes: [...prevState.rentTypes, value]
                }));
            } else {
                setBuildingSearch(prevState => ({
                    ...prevState,
                    rentTypes: prevState.rentTypes.filter(id => id !== value)
                }));
            }
        } else {
            // Xử lý khi là Select hoặc các trường input khác
            setBuildingSearch(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '30px', p: '30px' }}>
                <Box sx={{ width: '15%' }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">---Chọn Quận---</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="district"
                            value={buildingSearch.district}
                            label="---Chọn Quận---"
                            onChange={handleChange}
                        >
                            {districts.map((district) =>
                                <MenuItem value={district.id}>{district.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <TextField
                    id="areaFrom"
                    name="areaFrom"
                    label="Diện tích thuê từ"
                    variant="outlined"
                    value={buildingSearch.areaFrom}
                    onChange={handleChange}
                    type="number"
                />
                <TextField
                    id="rentPriceFrom"
                    name="rentPriceFrom"
                    label="Giá thuê từ"
                    variant="outlined"
                    value={buildingSearch.rentPriceFrom}
                    onChange={handleChange}
                    type="number"
                />
                <Button variant="contained" startIcon={<SearchIcon style={{ fontSize: '40px' }} />} onClick={handleGetBuilding}>
                    Tìm kiếm
                </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <Typography color='rgba(0, 0, 0, 0.6)' fontWeight='bold'>Loại tòa nhà: </Typography>
                {rentTypes.map((rentType) =>
                    <FormControlLabel control={<Checkbox />} value={rentType.id} onChange={handleChange} label={rentType.name} />
                )
                }
            </Box>
            {buidingData.length === 0 ? <Box sx={{ display: 'flex', justifyContent: 'center', pt: 20 }}><Typography variant='h6' color='rgba(0, 0, 0, 0.6)'>Không có kết quả</Typography></Box> :
                <Box sx={{ display: 'flex', gap: '30px', p: '30px', flexWrap: 'wrap' }} >
                    {
                        buidingData.map((building) =>
                            <CardBuilding CardObject={building}></CardBuilding>
                        )
                    }
                </Box >
            }
        </>
    );
}

export default RealEstateProject;