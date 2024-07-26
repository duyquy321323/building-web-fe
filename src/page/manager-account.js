import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Snackbar, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ManagerAccount = () => {
    const [fullname, setFullname] = useState("");
    const handleChange = (event) => {
        const { value } = event.target;
        setFullname(value);
    }

    const userData = useSelector((state) => {
        return state.auth.userData;
    });
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        getAccount();
    }, [refresh]);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const [scroll, setScroll] = React.useState('paper');
    const [contentPrevDelete, setContentPrevDelete] = useState("");
    const [openDialogPrevDelete, setOpenDialogPrevDelete] = useState(false);
    const [content, setContent] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const handleClickOpenPreDelete = (scrollType, row) => () => {
        setOpenDialogPrevDelete(true);
        setScroll(scrollType);
        console.log("Click open dialog1");
        console.log(selectedRows);
        if (!Array.isArray(row) || (Array.isArray(row) && Array.from(row).length > 0)) {
            setSelectedRows([row]);
            setContentPrevDelete("Chú chắc chứ?");
        }
        else {
            setContentPrevDelete("Vui lòng chọn tài khoản để xóa!")
        }
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

    const navigate = useNavigate();
    const columns = [
        { field: 'username', headerName: 'Tên tài khoản', width: 600, align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'fullname', headerName: 'Họ và tên', width: 600, align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'roles', headerName: 'Vai trò', width: 600, align: 'center', headerAlign: 'center', flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(params.row)}
                >
                    <EditIcon />
                </Button>
            ),
            align: 'center',
            headerAlign: 'center',
            flex: 1
        }
    ];
    const handleEditClick = (row) => {
        sessionStorage.setItem("accountUsername", row.username);
        navigate("/admin/account-edit")
    };
    const [selectedRows, setSelectedRows] = React.useState([]);
    const handleSelectionChange = (selection) => {
        setSelectedRows(selection);
    };
    const [users, setUsers] = useState([]);
    const getAccount = async () => {
        try {
            const response = await api.get(`/admin/account?fullname=${fullname}&id=${userData.id}`);
            console.log(response);
            const userArray = response.data;
            setUsers(userArray);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleNavigate = (e) => {
        console.log("handle navigate");
        navigate(e);
    }

    const handleDeleteUser = async () => {
        try {
            if (selectedRows.length > 0) {
                const ids = selectedRows.join(",");
                await api.delete(`/admin/account/${ids}`);
                setRefresh(pre => !pre);
                setSelectedRows([]);
                setOpenDialogPrevDelete(false);
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

    const handleCloseDialogPrevDelete = () => {
        console.log("close dialog");
        setSelectedRows([]);
        setOpenDialogPrevDelete(false);
    };

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography color='rgb(25, 118, 210)' fontWeight={'900'}>Tìm kiếm tài khoản</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <TextField
                            id="fullname"
                            name="fullname"
                            label="Nhập tên cần tìm"
                            variant="outlined"
                            value={fullname}
                            onChange={handleChange}
                            size='small'
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ margin: '30px 0' }}>
                        <Button sx={{ height: '50px' }} variant="contained" startIcon={<SearchIcon style={{ fontSize: '40px' }} />} onClick={getAccount}>
                            Tìm kiếm
                        </Button>
                    </Box>
                </AccordionDetails>
                <Box sx={{ display: 'flex', gap: '10px', my: '10px' }}>
                    <Button color='error' variant="contained" title='Xóa tài khoản được chọn' onClick={handleClickOpenPreDelete('paper', selectedRows)} size='small'><PersonRemoveIcon style={{ fontSize: '30px' }} />
                    </Button>
                    <Button color='success' variant="contained" title='Thêm tài khoản' onClick={() => handleNavigate("admin/account-new")} size='small'><PersonAddAlt1Icon style={{ fontSize: '30px' }} />
                    </Button>
                </Box>
            </Accordion>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    hideFooterSelectedRowCount
                    checkboxSelection
                    disableColumnMenu
                    disableRowSelectionOnClick
                    disableColumnResize
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
                                <Button onClick={handleDeleteUser}>Xóa</Button>
                            </Box> : <Button onClick={handleCloseDialogPrevDelete}>Đóng</Button>
                        }
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={content}
            />
        </>
    );
}

export default ManagerAccount;