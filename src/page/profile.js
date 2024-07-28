import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../api";
import { updateDataSuccess } from '../redux/actions';
import { useSnackbar } from './snackbarcontext';

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

const Profile = (userData) => {

    const [profile, setProfile] = useState({
        fullname: "",
        email: "",
        avatar: null
    });

    const dispatch = useDispatch();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const { showSnackbar } = useSnackbar();

    const handleEditProfile = async () => {
        try {
            const formData = new FormData();
            if (profile) {
                Object.keys(profile).forEach(key => {
                    if (profile[key] !== undefined && profile[key] !== null) {
                        formData.append(key, profile[key]);
                    }
                });

                // Thêm dữ liệu tập tin từ phần tử đầu vào HTML
                const fileInput = document.querySelector('input[name="avatar"]');
                if (fileInput && fileInput.files.length > 0) {
                    formData.append('avatar', fileInput.files[0]);
                } else {
                    console.error('No file selected');
                }
                const response = await api.put(`/account/profile-edit?id=${userData.userData.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Đảm bảo đúng kiểu dữ liệu cho tải lên tập tin
                    },
                });

                if (response.status === 201 || response.status === 200) {
                    showSnackbar("Cập nhật thành công");
                    const userDataUpdate = response.data;
                    console.log("User update: " + userDataUpdate);
                    console.log("Res: " + response);
                    dispatch(updateDataSuccess(userDataUpdate));
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showSnackbar("Yêu cầu không hợp lệ.");
            } else {
                showSnackbar("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
            console.error('Error logging in:', error);
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px', mt: '30px', width: '50%', mx: 'auto' }}>
                <TextField
                    id="fullname"
                    name="fullname"
                    label="Họ và tên"
                    variant="outlined"
                    value={profile.fullname}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={profile.email}
                    onChange={handleChange}
                    size='small'
                    fullWidth
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', mx: 'auto' }}>
                    <Typography color='rgba(0, 0, 0, 0.6)' fontWeight='bold' align='center'>Ảnh đại diện</Typography>
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
                            name="avatar"
                            id="avatar" />
                    </Button>
                </Box>
                <Button color='success' sx={{ height: '50px' }} fullWidth variant="contained" onClick={handleEditProfile}>
                    Cập nhật
                </Button>
            </Box>
        </>
    );
}

export default Profile;