import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useSnackbar } from './snackbarcontext';

const ManagerCustomer = () => {
    const [searchCustomer, setSearchCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        staffId: null
    });
    const [selectUserCheck, setSelectUserCheck] = useState([]);
    const [requestParamPath, setRequestParamPath] = useState(null);
    const [idUserDialog, setIdUserDialog] = useState(selectUserCheck);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [idCustomerDialog, setIdCustomerDialog] = useState(null);
    const [scroll, setScroll] = React.useState('paper');
    const [contentPrevDelete, setContentPrevDelete] = useState("");
    const [openDialogPrevDelete, setOpenDialogPrevDelete] = useState(false);
    const [users, setUsers] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [refresh, setRefresh] = useState(false);
    const userData = useSelector((state) => {
        return state.auth.userData;
    })

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

    const handleGetStaffByIdCustomer = async () => {
        console.log("get staff by id building");
        try {
            console.log(`/admin/staffs?idBuilding=${selectedRows.at(0)}`);
            const response = await api.get(`/admin/staffs?idCustomer=${selectedRows.at(0)}`);
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

    useEffect(() => {
        console.log("effect select row and opendialog");
        handleGetStaffByIdCustomer();
    }, [openDialog])

    useEffect(() => {

        console.log("effect select user check");
        console.log(selectUserCheck);
        setIdUserDialog(selectUserCheck);
    }, [selectUserCheck])


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleGetCustomer = async () => {
        try {
            const response = await api.post(`/customer/`, searchCustomer);
            if (response && response.data) {
                // Kiểm tra dữ liệu ngày tháng trước khi sử dụng
                const formattedData = response.data.content.map(customer => ({
                    ...customer,
                    createdDate: customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : 'N/A'
                }));
                setCustomerData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSearchCustomer((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectionChange = (selection) => {
        console.log("new selecrow: " + selection);
        setSelectedRows(selection);
    };
    useEffect(() => {
        handleGetCustomer();
    }, [refresh]);

    const handleClickOpenPreDelete = (scrollType, row) => () => {
        setOpenDialogPrevDelete(true);
        setScroll(scrollType);
        console.log("Click open dialog1");
        if (!Array.isArray(row)) {
            setSelectedRows([row]);
            setContentPrevDelete("Chú chắc chứ?");
        }
        else if ((Array.isArray(row) && Array.from(row).length > 0)) {
            setSelectedRows(row);
            setContentPrevDelete("Chú chắc chứ?");
        } else {
            setContentPrevDelete("Vui lòng chọn tài khoản để xóa!")
        }
    };
    const { showSnackbar } = useSnackbar();
    const handleDeleteCustomer = async () => {
        try {
            if (selectedRows.length > 0) {
                const ids = selectedRows.join(",");
                await api.delete(`/customer/?id=${ids}`);
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

    const handleCloseDialogPrevDelete = () => {
        console.log("close dialog");
        setOpenDialogPrevDelete(false);
    };

    const handleClickOpen = (scrollType, row) => () => {
        setSelectedRows([row.id]);
        setScroll(scrollType);
        console.log("Click open dialog1");
        setOpenDialog(true);
    };
    const handleNavigate = (e, r) => {
        console.log("handle navigate");
        if (r) {
            sessionStorage.setItem("idCustomer", r.id);
        }
        navigate(e);
    }

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

    const navigate = useNavigate();

    useEffect(() => {
        // Xây dựng chuỗi requestParam
        console.log("effect id user dialog");
        console.log(idUserDialog);
        setRequestParamPath(`/admin/assign-customer?idStaff=${idUserDialog.join(',')}&idCustomer=${idCustomerDialog}`);
        // Bạn có thể gửi requestParam này đến server hoặc làm gì đó với nó ở đây.
    }, [idUserDialog]);

    const handleAssignmentCustomer = async () => {
        console.log("assignment customer");
        try {
            const response = await api.put(`${requestParamPath}`);
            if (response.status === 200) {
                setIdUserDialog(idUserDialog);
                showSnackbar("Giao khách hàng cho nhân viên thành công.");
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


    const handleChangeDialog = (event) => {
        console.log("change dialog");
        const { value, checked } = event.target;
        // Xử lý khi là Checkbox
        if (selectedRows.length === 1) {
            setIdCustomerDialog(selectedRows.at(0));
            if (checked) {
                setSelectUserCheck([...selectUserCheck, Number(value)]);
                setIdUserDialog([...idUserDialog, Number(value)]);

            } else {
                setIdUserDialog(idUserDialog.filter(id => id !== Number(value)));
                setSelectUserCheck(selectUserCheck.filter(id => id !== Number(value)));
            }
        }
    };

    const handleCloseDialog = () => {
        console.log("close dialog");
        setSelectedRows([]);
        setOpenDialog(false);
    };

    const columns = [
        { field: 'fullname', headerName: 'Tên khách hàng', width: 200, flex: 1 },
        { field: 'phone', headerName: 'Số điện thoại', width: 200, flex: 1 },
        { field: 'email', headerName: 'Email', width: 150, flex: 1 },
        { field: 'demand', headerName: 'Nhu cầu', width: 150, flex: 1 },
        { field: 'createdBy', headerName: 'Người thêm', width: 150, flex: 1 },
        {
            field: 'createdDate',
            headerName: 'Ngày thêm',
            width: 150,
            flex: 1
        },
        { field: 'status', headerName: 'Tình trạng', width: 180, flex: 1 }
    ];

    if (userData.roles.includes("MANAGER")) {
        columns.push(
            {
                field: 'action',
                headerName: 'Thao tác',
                width: 250,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }} my={0.3}>
                        <Button
                            title='Chỉnh sửa khách hàng'
                            variant="contained"
                            color="primary"
                            onClick={() => handleNavigate("/customer/edit", params.row)}
                            size='small'
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            title='Giao khách hàng'
                            variant="contained"
                            color="secondary"
                            onClick={handleClickOpen('paper', params.row)}
                            size='small'
                        >
                            <AssignmentIcon />
                        </Button>
                        <Button
                            title='Xóa khách hàng'
                            variant="contained"
                            color="error"
                            size='small'
                            onClick={handleClickOpenPreDelete('paper', params.row.id)}
                        >
                            <PersonRemoveIcon />
                        </Button>
                    </Box>
                ),
                align: 'center',
                headerAlign: 'center'
            }
        )
    } else if (userData.roles.includes("STAFF")) {
        columns.push(
            {
                field: 'action',
                headerName: 'Thao tác',
                width: 250,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }} my={0.3}>
                        <Button
                            title='Chỉnh sửa khách hàng'
                            variant="contained"
                            color="primary"
                            onClick={() => handleNavigate("/customer/edit", params.row)}
                            size='small'
                        >
                            <EditIcon />
                        </Button>
                    </Box>
                ),
                align: 'center',
                headerAlign: 'center'
            }
        )
    }

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

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography color='rgb(25, 118, 210)' fontWeight={'900'}>Tìm kiếm khách hàng</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container my={3} justifyContent={'space-between'}>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="name"
                                    name="name"
                                    label="Tên khách hàng"
                                    variant="outlined"
                                    value={searchCustomer.name}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="phone"
                                    name="phone"
                                    label="Số điện thoại"
                                    variant="outlined"
                                    value={searchCustomer.phone}
                                    onChange={handleChange}
                                    size='small'
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3.75}>
                            <Box>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    value={searchCustomer.email}
                                    onChange={handleChange}
                                    size='small'
                                    type="email"
                                    fullWidth
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {
                        userData.roles.includes('MANAGER') ?
                            <Grid container my={3}>
                                <Grid item xs={3.75}>
                                    <Box>
                                        <FormControl fullWidth size='small'>
                                            <InputLabel id="demo-simple-select-label">---Nhân viên quản lý---</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name="staffId"
                                                value={searchCustomer.staffId}
                                                label="---Nhân viên quản lý---"
                                                onChange={handleChange}
                                            >
                                                {users.map((user) =>
                                                    <MenuItem value={user.name.id}>{user.name.fullname}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid> : <></>
                    }
                    <Button sx={{ height: '50px' }} variant="contained" startIcon={<SearchIcon style={{ fontSize: '40px' }} />} onClick={handleGetCustomer}>
                        Tìm kiếm
                    </Button>

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
                                    <Button onClick={handleAssignmentCustomer}>Giao</Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '10px', my: '10px' }}>
                        <Button color='error' variant="contained" title='Xóa khách hàng được chọn' onClick={handleClickOpenPreDelete('paper', selectedRows)} size='small'><GroupRemoveIcon style={{ fontSize: '30px' }} />
                        </Button>
                        <Button color='success' variant="contained" title='Thêm khách hàng' onClick={() => handleNavigate("/customer/new")} size='small'><PersonAddAlt1Icon style={{ fontSize: '30px' }} />
                        </Button>
                    </Box>
                </Box> : <Box sx={{ height: '40px' }}></Box>
            }
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={customerData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    hideFooterSelectedRowCount
                    disableRowSelectionOnClick
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
                                <Button onClick={handleDeleteCustomer}>Xóa</Button>
                            </Box> : <Button onClick={handleCloseDialogPrevDelete}>Đóng</Button>
                        }
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}

export default ManagerCustomer;