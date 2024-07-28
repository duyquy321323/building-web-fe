import AssignmentIcon from '@mui/icons-material/Assignment';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import DomainDisabledIcon from '@mui/icons-material/DomainDisabled';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSnackbar } from './snackbarcontext';


const BuildingSearch = () => {
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
    console.log("render again!----------------------------------------");
    const [districts, setDistricts] = useState([]);
    const [users, setUsers] = useState([]);

    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [selectUserCheck, setSelectUserCheck] = useState([]);
    const [idUserDialog, setIdUserDialog] = useState(selectUserCheck);
    const [idBuildingDialog, setIdBuildingDialog] = useState(null);
    const [requestParamPath, setRequestParamPath] = useState(null);
    const [scroll, setScroll] = React.useState('paper');
    const [contentPrevDelete, setContentPrevDelete] = useState("");
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector((state) => {
        return state.auth.userData;
    })

    const fetchDistricts = async () => {
        try {
            const response = await api.get('/util/district-code');
            const districtArray = Object.keys(response.data).map(key => ({
                id: key,
                name: response.data[key]
            }));
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
            setRentTypes(rentTypeArray);
        } catch (error) {
            console.error("Error fetching rent types:", error);
        }
    };

    useEffect(() => {
        fetchRentTypes();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/staffs');
            const userArray = Object.keys(response.data.content).map(key => ({
                id: key,
                name: response.data.content[key]
            }));
            setUsers(userArray);
            console.log("user", userArray);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const { showSnackbar } = useSnackbar();

    const [buidingData, setBuildingData] = useState([]);
    const handleGetBuilding = async () => {
        try {
            const response = await api.post(`/buildings/search`, buildingSearch);
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

    const handleChangeDialog = (event) => {
        console.log("change dialog");
        const { value, checked } = event.target;
        // Xử lý khi là Checkbox
        if (selectedRows.length === 1) {
            setIdBuildingDialog(selectedRows.at(0));
            if (checked) {
                setSelectUserCheck([...selectUserCheck, Number(value)]);
                setIdUserDialog([...idUserDialog, Number(value)]);

            } else {
                setIdUserDialog(idUserDialog.filter(id => id !== Number(value)));
                setSelectUserCheck(selectUserCheck.filter(id => id !== Number(value)));
            }
        }
    };

    useEffect(() => {
        // Xây dựng chuỗi requestParam
        console.log("effect id user dialog");
        console.log(idUserDialog);
        setRequestParamPath(`/admin/assign-building?id=${idUserDialog.join(',')}&buildingId=${idBuildingDialog}`);
        // Bạn có thể gửi requestParam này đến server hoặc làm gì đó với nó ở đây.
    }, [idUserDialog]);

    const handleAssignmentBuilding = async () => {
        console.log("assignment building");
        try {
            const response = await api.post(`${requestParamPath}`);
            if (response.status === 200) {
                setIdUserDialog(idUserDialog);
                showSnackbar("Giao tòa nhà cho nhân viên thành công.");
                setOpenDialog(false);
                setSelectedRows([]);
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

    const handleSelectionChange = (selection) => {
        setSelectedRows(selection);
    };

    const handleDeleteBuilding = async () => {
        try {
            if (selectedRows.length > 0) {
                const ids = selectedRows.join(",");
                await api.delete(`/buildings/${ids}`);
                setRefresh(pre => !pre);
                setSelectedRows([]);
                setOpenDialogPrevDelete(false);
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

    useEffect(() => {
        handleGetBuilding();
    }, [refresh]);

    const handleNavigate = (e, r) => {
        console.log("handle navigate");
        if (r) {
            sessionStorage.setItem("idBuilding", r.id);
        }
        navigate(e);
    }

    const handleClickOpen = (scrollType, row) => () => {
        setSelectedRows([row.id]);
        setScroll(scrollType);
        console.log("Click open dialog1");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        console.log("close dialog");
        setSelectedRows([]);
        setOpenDialog(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        console.log("effect open dialog");
        if (openDialog) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openDialog]);


    const handleGetStaffByIdBuilding = async () => {
        console.log("get staff by id building");
        try {
            console.log(`/admin/staffs?idBuilding=${selectedRows.at(0)}`);
            const response = await api.get(`/admin/staffs?idBuilding=${selectedRows.at(0)}`);
            if (response.data.content) {
                console.log(response.data.content);
                const userArray = Object.values(response.data.content).map(it => (
                    it.id
                ));
                console.log(userArray);
                setSelectUserCheck(userArray);
            } else {
                setSelectUserCheck([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const [openDialogPrevDelete, setOpenDialogPrevDelete] = useState(false);
    const handleClickOpenPreDelete = (scrollType, row) => () => {
        setOpenDialogPrevDelete(true);
        setScroll(scrollType);
        console.log("Click open dialog1");
        console.log(selectedRows);
        if (!Array.isArray(row)) {
            setSelectedRows([row]);
            setContentPrevDelete("Chú chắc chứ?");
        }
        else if ((Array.isArray(row) && Array.from(row).length > 0)) {
            setSelectedRows(row);
            setContentPrevDelete("Chú chắc chứ?");
        } else {
            setContentPrevDelete("Vui lòng chọn tòa nhà để xóa!")
        }
    };

    const handleCloseDialogPrevDelete = () => {
        console.log("close dialog");
        setOpenDialogPrevDelete(false);
    };

    const descriptionElementDeleteRef = React.useRef(null);
    React.useEffect(() => {
        console.log("effect open dialog");
        if (openDialogPrevDelete) {
            const { current: descriptionElement } = descriptionElementDeleteRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openDialogPrevDelete]);

    useEffect(() => {
        console.log("effect select row and opendialog");
        handleGetStaffByIdBuilding();
    }, [openDialog])

    useEffect(() => {

        console.log("effect select user check");
        console.log(selectUserCheck);
        setIdUserDialog(selectUserCheck);
    }, [selectUserCheck])

    const columns = [
        { field: 'name', headerName: 'Tên tòa nhà', width: 200, flex: 1 },
        { field: 'address', headerName: 'Địa chỉ', width: 200, flex: 1 },
        { field: 'numberOfBasement', headerName: 'Số tầng hầm', width: 150, flex: 1 },
        { field: 'managerName', headerName: 'Tên quản lý', width: 150, flex: 1 },
        { field: 'managerPhoneNumber', headerName: 'SDT quản lý', width: 150, flex: 1 },
        { field: 'floorArea', headerName: 'Diện tích sàn', width: 150, flex: 1 },
        { field: 'emptySpace', headerName: 'Diện tích trống', width: 180, flex: 1 },
        { field: 'leasedArea', headerName: 'Diện tích thuê', width: 170, flex: 1 },
        { field: 'rentPrice', headerName: 'Giá thuê', width: 110, flex: 1 },
        { field: 'serviceFee', headerName: 'Phí dịch vụ', width: 160, flex: 1 },
        { field: 'brokerageFee', headerName: 'Phí môi giới', width: 150, flex: 1 }
    ];
    if (userData.roles.includes("MANAGER")) {
        columns.push({
            field: 'action',
            headerName: 'Thao tác',
            width: 250,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }} my={0.3}>
                    <Button
                        title='Chỉnh sửa tòa nhà'
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate("/buildings/edit", params.row)}
                        size='small'
                    >
                        <EditIcon />
                    </Button>
                    <Button
                        title='Giao tòa nhà'
                        variant="contained"
                        color="secondary"
                        onClick={handleClickOpen('paper', params.row)}
                        size='small'
                    >
                        <AssignmentIcon />
                    </Button>
                    <Button
                        title='Xóa tòa nhà'
                        variant="contained"
                        color="error"
                        size='small'
                        onClick={handleClickOpenPreDelete('paper', params.row.id)}
                    >
                        <DomainDisabledIcon />
                    </Button>
                </Box>
            ),
            align: 'center',
            headerAlign: 'center'
        })
    };

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography color='rgb(25, 118, 210)' fontWeight={'900'}>Tìm kiếm tòa nhà</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container my={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={5.75}>
                            <Box>
                                <TextField
                                    id="name"
                                    name="name"
                                    label="Tên tòa nhà"
                                    variant="outlined"
                                    value={buildingSearch.name}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={5.75}>
                            <Box>
                                <TextField
                                    id="floorArea"
                                    name="floorArea"
                                    label="Diện tích sàn"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.floorArea}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container my={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={2.75}>
                            <Box>
                                <FormControl fullWidth size='small'>
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
                        </Grid>
                        <Grid item xs={4.25}>
                            <Box>
                                <TextField
                                    id="ward"
                                    name="ward"
                                    label="Phường"
                                    variant="outlined"
                                    value={buildingSearch.ward}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4.25}>
                            <Box>
                                <TextField
                                    id="street"
                                    name="street"
                                    label="Đường"
                                    variant="outlined"
                                    value={buildingSearch.street}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container my={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="numberOfBasement"
                                    name="numberOfBasement"
                                    label="Số tầng hầm"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.numberOfBasement}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="direction"
                                    name="direction"
                                    label="Hướng"
                                    variant="outlined"
                                    value={buildingSearch.direction}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="level"
                                    name="level"
                                    label="hạng"
                                    variant="outlined"
                                    value={buildingSearch.level}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container my={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={2.75}>
                            <Box>
                                <TextField
                                    id="areaFrom"
                                    name="areaFrom"
                                    label="Diện tích từ"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.areaFrom}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2.75}>
                            <Box>
                                <TextField
                                    id="areaTo"
                                    name="areaTo"
                                    label="Diện tích đến"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.areaTo}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2.75}>
                            <Box>
                                <TextField
                                    id="rentPriceFrom"
                                    name="rentPriceFrom"
                                    label="Giá thuê từ"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.rentPriceFrom}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2.75}>
                            <Box>
                                <TextField
                                    id="rentPriceTo"
                                    name="rentPriceTo"
                                    label="Giá thuê đến"
                                    variant="outlined"
                                    type='number'
                                    value={buildingSearch.rentPriceTo}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container my={3} sx={{ justifyContent: 'space-between' }}>
                        <Grid item xs={4.25}>
                            <Box>
                                <TextField
                                    id="managerName"
                                    name="managerName"
                                    label="Tên nhân viên quản lý"
                                    variant="outlined"
                                    value={buildingSearch.managerName}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4.25}>
                            <Box>
                                <TextField
                                    id="managerPhoneNumber"
                                    name="managerPhoneNumber"
                                    label="Số điện thoại nhân viên quản lý"
                                    variant="outlined"
                                    value={buildingSearch.managerPhoneNumber}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={2.75}>
                            {userData.roles.includes("MANAGER") ?
                                <Box>
                                    <FormControl fullWidth size='small'>
                                        <InputLabel id="demo-simple-select-label">---Nhân viên phụ trách---</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="userId"
                                            value={buildingSearch.userId}
                                            label="---Nhân viên phụ trách---"
                                            onChange={handleChange}
                                        >
                                            {users.map((user) =>
                                                <MenuItem value={user.name.id}>{user.name.fullname}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box> : <></>
                            }
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <Box>
                            <Typography color='rgba(0, 0, 0, 0.6)' fontWeight='bold'>Loại tòa nhà: </Typography>
                            {rentTypes.map((rentType) =>
                                <FormControlLabel control={<Checkbox />} value={rentType.id} onChange={handleChange} label={rentType.name} />
                            )
                            }
                        </Box>
                        <Box>
                            <Button sx={{ height: '50px' }} variant="contained" startIcon={<SearchIcon style={{ fontSize: '40px' }} />} onClick={handleGetBuilding}>
                                Tìm kiếm
                            </Button>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
            {userData.roles.includes("MANAGER") ?
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '10px', my: '10px' }}>
                        <React.Fragment>
                            <Dialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                scroll={scroll}
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                            >
                                <DialogTitle id="scroll-dialog-title">Chọn nhân viên để giao</DialogTitle>
                                <DialogContent dividers={scroll === 'paper'}>
                                    <DialogContentText
                                        id="scroll-dialog-description"
                                        ref={descriptionElementRef}
                                        tabIndex={-1}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            {console.log("userHTML" + users.map(user => selectUserCheck.includes(user.name.id)))}
                                            {console.log("selectHTML" + selectUserCheck)}
                                            {users.map((user) =>
                                                <FormControlLabel control={<Checkbox checked={selectUserCheck.includes(user.name.id)} onChange={handleChangeDialog} />} value={user.name.id} label={user.name.fullname} />
                                            )
                                            }
                                        </Box>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Hủy thao tác</Button>
                                    <Button onClick={handleAssignmentBuilding}>Giao</Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '10px', my: '10px' }}>
                        <Button color='error' variant="contained" title='Xóa tòa nhà được chọn' onClick={handleClickOpenPreDelete('paper', selectedRows)} size='small'><DomainDisabledIcon style={{ fontSize: '30px' }} />
                        </Button>
                        <Button color='success' variant="contained" title='Thêm tòa nhà' onClick={() => handleNavigate("/buildings/new")} size='small'><DomainAddIcon style={{ fontSize: '30px' }} />
                        </Button>
                    </Box>
                </Box> : <Box sx={{ height: '40px' }}></Box>
            }
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={buidingData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    hideFooterSelectedRowCount
                    disableRowSelectionOnClick
                    checkboxSelection
                    disableColumnMenu
                    rowSelectionModel={selectedRows}
                    onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                />
            </div>
            <React.Fragment>
                <Dialog
                    open={openDialogPrevDelete}
                    onClose={handleCloseDialogPrevDelete}
                    scroll={scroll}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementDeleteRef}
                            tabIndex={-1}
                        >
                            {contentPrevDelete}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {selectedRows.length > 0 ?
                            <Box>
                                <Button onClick={handleCloseDialogPrevDelete}>Hủy thao tác</Button>
                                <Button onClick={handleDeleteBuilding}>Xóa</Button>
                            </Box> : <Button onClick={handleCloseDialogPrevDelete}>Đóng</Button>
                        }
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}

export default BuildingSearch;