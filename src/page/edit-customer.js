import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { useSnackbar } from './snackbarcontext';

const EditCustomer = () => {
    console.log("-----------------------------re-render-------------------------------");
    const [editCustomer, setEditCustomer] = useState({
        fullname: "",
        phone: "",
        email: "",
        nameCompany: "",
        demand: "",
        status: ""
    });

    const navigate = useNavigate();

    const handleCloseEdit = useCallback(() => {
        console.log("Dòng 23: handleCloseEdit");
        sessionStorage.removeItem("idCustomer");
        navigate("/customer/");
    }, [navigate]);

    const [status, setStatus] = useState([]);

    const fetchStatus = useCallback(async () => {
        console.log("Dòng 42: fetchStatus");
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
    }, []);

    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        console.log("Dòng 57: useEffect--fetchStatus");
        fetchStatus();
    }, [fetchStatus]);
    const handleEditCustomer = useCallback(async () => {
        console.log("Dòng 61: handleEditCustomer");
        try {
            const response = await api.put(`/customer/?id=${sessionStorage.getItem('idCustomer')}`, editCustomer);
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
    }, [editCustomer, handleCloseEdit]);
    console.log("Dòng 76: editCustomerDebounce");
    const editCustomerDebounce = useCallback(
        debounce(handleEditCustomer, 200), [handleEditCustomer]
    );

    const handleChange = useCallback((event) => {
        console.log("Dòng 85: handleChange");
        const { name, value } = event.target;
        setEditCustomer((prev) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [transactionTypes, setTransactionTypes] = useState([]);
    const fetchTransactionTypes = useCallback(async () => {
        console.log("Dòng 115: fetchTransactionTypes");
        const response = await api.get('/util/transaction-code');
        const transactionTypesArray = Object.keys(response.data).map(key => ({
            id: key,
            name: response.data[key]
        }));
        setTransactionTypes(transactionTypesArray);
    }, []);

    useEffect(() => {
        console.log("Dòng 125: fetchTransactionTypes--useEffect");
        fetchTransactionTypes();
    }, [fetchTransactionTypes]);

    const handleClickOpenAdd = useCallback((id) => {
        console.log("Dòng 130: handleClickOpenAdd");
        setCode(id);
        setOpenAdd(true);
    }, []);

    const handleCloseAdd = useCallback(() => {
        console.log("Dòng 136: handleCloseAdd");
        setNote("");
        setOpenAdd(false);
        setErrors({
            note: false
        })
    }, []);

    const [note, setNote] = useState("");

    const [errors, setErrors] = useState({
        note: false
    });

    const [transactionData, setTransactionData] = useState([[]]);
    const getTransactionData = useCallback(async () => {
        console.log("Dòng 145: getTransactionData");
        for (const transactionType of transactionTypes) {
            try {
                const response = await api.get(`/transaction/?id=${sessionStorage.getItem("idCustomer")}&code=${transactionType.id}`);
                if (response && response.status === 200) {
                    // Kiểm tra dữ liệu ngày tháng trước khi sử dụng
                    const formattedData = response.data.map(transaction => ({
                        ...transaction,
                        createdDate: transaction.createdDate ? new Date(transaction.createdDate).toLocaleDateString() : 'N/A',
                        modifiedDate: transaction.createdDate ? new Date(transaction.modifiedDate).toLocaleDateString() : 'N/A',
                        type: transactionType.id
                    }));
                    setTransactionData(prev => [...prev, formattedData]);
                }
                else {
                    console.log("Yêu cầu không hợp lệ");
                }
            } catch (error) {
                console.error("Error fetching transaction data:", error);
            }
        }
    }, [transactionTypes]);
    const transactionDataDebounce = useCallback(
        debounce(() => {
            console.log("Dòng 169: transactionDataDebounce");
            setTransactionData(prev => prev.map(() => []));
            setTransactionData([[]]);
            getTransactionData();
        }, 200), [getTransactionData]
    );

    useEffect(() => {
        console.log("Dòng 177: transactionData--useEffect");
        if (Array.isArray(transactionData[0]) && transactionData[0].length === 0 && transactionData.length > 1) {
            setTransactionData(prev => prev.slice(1));
        }
    }, [transactionData])

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        console.log("Dòng 186: transactionTypes, refresh--useEffect");
        if (transactionTypes.length > 0) {
            transactionDataDebounce();
        }
    }, [transactionTypes, refresh, transactionDataDebounce])

    const [openAdd, setOpenAdd] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [code, setCode] = useState();

    const handleNote = useCallback((e) => {
        console.log("Dòng 197: handleNote");
        setNote(e.target.value);
        if (e.target !== "") {
            setErrors(({
                note: false
            }));
        }
    }, []);

    const handleBlur = (event) => {
        const { name, value } = event.target;
        if (value.trim() === "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: true,
            }));
        }
    };

    const handleCreateTransaction = useCallback(async () => {
        if (!note.trim()) {
            setErrors({
                note: !note.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        console.log("Dòng 202: handleCreateTransaction");
        try {
            const response = await api.post(`/transaction/?id=${sessionStorage.getItem('idCustomer')}&note=${note}&code=${code}`);
            if (response && response.status === 201) {
                setRefresh(pre => !pre);
                setOpenAdd(false);
            }
        } catch (error) {
            console.log(error);
        }
    }, [note, code]);

    const createTransactionDebounce = useCallback(
        debounce(() => {
            console.log("Dòng 216: createTransactionDebounce");
            handleCreateTransaction();
        }, 200), [handleCreateTransaction]
    );

    const [idTran, setIdTran] = useState();

    const handleEditOpen = useCallback((id) => {
        console.log("Dòng 224: handleEditOpen");
        setIdTran(id);
        setOpenEdit(true);
    }, []);
    const handleEditClose = useCallback(() => {
        console.log("Dòng 229: handleEditClose");
        setNoteEdit("");
        setOpenEdit(false);
        setErrors({
            note: false
        })
    }, []);

    const [noteEdit, setNoteEdit] = useState();

    const changeNote = useCallback((e) => {
        console.log("Dòng 237: changeNote");
        setNoteEdit(e.target.value);
        if (e.target !== "") {
            setErrors(({
                note: false
            }));
        }
    }, []);

    const handleEditTransaction = useCallback(async () => {
        if (!note.trim()) {
            setErrors({
                note: !note.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        console.log("Dòng 242: handleEditTransaction");
        try {
            const response = await api.put(`/transaction/?note=${noteEdit}&idTransaction=${idTran}`);
            if (response && response.status === 200) {
                setRefresh(pre => !pre);
                setOpenEdit(false);
            }
        } catch (error) {
            console.log(error);
        }
    }, [noteEdit, idTran]
    );

    const editTransactionDebounce = useCallback(
        debounce(() => {
            console.log("Dòng 257: editTransactionDebounce");
            handleEditTransaction();
        }, 200), [handleEditTransaction]
    );

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '50%', gap: '30px', margin: '30px auto' }}>
                <Typography color='rgb(25, 118, 210)' fontWeight={'900'} lineHeight={3} >Thông tin khách hàng</Typography>
                <Box>
                    <TextField
                        id="fullname"
                        name="fullname"
                        label="Tên khách hàng"
                        variant="outlined"
                        value={editCustomer.fullname}
                        onChange={handleChange}
                        size='small'
                        fullWidth
                    />
                </Box>
                <Box>
                    <TextField
                        id="phone"
                        name="phone"
                        label="Số điện thoại"
                        variant="outlined"
                        value={editCustomer.phone}
                        onChange={handleChange}
                        size='small'
                        fullWidth
                    />
                </Box>
                <Box>
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={editCustomer.email}
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
                        value={editCustomer.nameCompany}
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
                        value={editCustomer.demand}
                        onChange={handleChange}
                        size='small'
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
                            value={editCustomer.status}
                            label="---Trạng thái---"
                            onChange={handleChange}
                        >
                            {status.map((st) =>
                                <MenuItem value={st.id}>{st.name}</MenuItem>)
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
                        <Button fullWidth variant="contained" onClick={editCustomerDebounce} size='small'>
                            Cập nhật thông tin
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {transactionTypes.map((type) => {
                let transactionsOfType = [];
                if (!(Array.isArray(transactionData[0]) && transactionData[0].length === 0) && transactionData.length >= 1) {
                    transactionsOfType = transactionData
                        .filter(transactionArray => transactionArray.some(transaction => transaction.type === type.id));
                }
                return (
                    <>
                        <TableContainer component={Paper} key={type.id} sx={{ margin: '30px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" component="div" sx={{ margin: '10px' }}>
                                    {type.name}
                                </Typography>
                            </Box>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Nội dung</StyledTableCell>
                                        <StyledTableCell align='center'>Ngày tạo</StyledTableCell>
                                        <StyledTableCell align='center'>Người tạo</StyledTableCell>
                                        <StyledTableCell align='center'>Ngày sửa gần nhất</StyledTableCell>
                                        <StyledTableCell align='center'>Người sửa gần nhất</StyledTableCell>
                                        <StyledTableCell align='center'>Thao tác</StyledTableCell> {/* Thêm cột thao tác */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <>
                                        {transactionsOfType.length > 0 ? (
                                            transactionsOfType.map((data) => {
                                                const newdata = Array.from(data);
                                                return newdata.map((dt) => (
                                                    <StyledTableRow key={dt.id}>
                                                        <StyledTableCell>{dt.note}</StyledTableCell>
                                                        <StyledTableCell align='center'>{dt.createdDate}</StyledTableCell>
                                                        <StyledTableCell align='center'>{dt.createdBy}</StyledTableCell>
                                                        <StyledTableCell align='center'>{dt.modifiedDate}</StyledTableCell>
                                                        <StyledTableCell align='center'>{dt.modifiedBy}</StyledTableCell>
                                                        <StyledTableCell align='center'>
                                                            {/* Thêm nút thao tác */}
                                                            <Button variant="contained" color="info" startIcon={<EditIcon />} onClick={() => handleEditOpen(dt.id)}>
                                                                Cập nhật
                                                            </Button>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ));
                                            })
                                        ) : (
                                            <StyledTableRow>
                                                <StyledTableCell colSpan={6} align="center">
                                                    Không có giao dịch
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow>
                                            <StyledTableCell></StyledTableCell>
                                            <StyledTableCell align='center'></StyledTableCell>
                                            <StyledTableCell align='center'></StyledTableCell>
                                            <StyledTableCell align='center'></StyledTableCell>
                                            <StyledTableCell align='center'></StyledTableCell>
                                            <StyledTableCell colSpan={6} align="center">
                                                {/* Thêm nút thao tác */}
                                                <Button color="success" startIcon={<AddIcon />} variant="contained" onClick={() => handleClickOpenAdd(type.id)}>
                                                    Thêm
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </>
                );
            }
            )}
            <React.Fragment>
                <Dialog
                    open={openAdd}
                    onClose={handleCloseAdd}
                >
                    <DialogTitle>Thêm nội dung giao dịch</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="note"
                            value={note}
                            label="Nội dung giao dịch"
                            onChange={handleNote}
                            onBlur={handleBlur}
                            error={errors.note}
                            helperText={errors.note ? "Nội dung là bắt buộc" : ""}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAdd}>Hủy</Button>
                        <Button onClick={createTransactionDebounce}>Xác nhận</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog
                    open={openEdit}
                    onClose={handleCloseEdit}
                >
                    <DialogTitle>Cập nhật nội dung giao dịch</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="note"
                            value={noteEdit}
                            label="Nội dung giao dịch"
                            onChange={changeNote}
                            onBlur={handleBlur}
                            error={errors.note}
                            helperText={errors.note ? "Nội dung là bắt buộc" : ""}
                            required
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose}>Hủy</Button>
                        <Button onClick={editTransactionDebounce}>Xác nhận</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </>
    );
}

export default EditCustomer;