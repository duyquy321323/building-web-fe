import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api';

const ManagerAccount = () => {
    const [fullname, setFullname] = useState("");
    const handleChange = (event) => {
        const { value } = event.target;
        setFullname(value);
    }
    const columns = [
        { field: 'username', headerName: 'Tên tài khoản', width: 600, align: 'center', headerAlign: 'center', flex: 1 },
        { field: 'fullname', headerName: 'Họ và tên', width: 600, align: 'center', headerAlign: 'center', flex: 1 },
        {
            field: 'action',
            headerName: 'Thao tác',
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleButtonClick(params.row)}
                >
                    <EditIcon />
                </Button>
            ),
            align: 'center',
            headerAlign: 'center',
            flex: 1
        }
    ];
    const handleButtonClick = (row) => {
        console.log("Button clicked for row: ", row);
        // Thực hiện hành động bạn muốn ở đây
    };
    const [selectedRows, setSelectedRows] = React.useState([]);
    const handleSelectionChange = (selection) => {
        setSelectedRows(selection);
    };
    const [users, setUsers] = useState([]);
    const getAccount = async () => {
        try {
            const response = await api.get(`/admin/account?fullname=${fullname}`);
            console.log(response);
            const userArray = response.data;
            setUsers(userArray);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
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
        </>
    );
}

export default ManagerAccount;