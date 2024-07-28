import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import api from '../api';
import { useSnackbar } from "./snackbarcontext";

const Contact = () => {

    const [userInfo, setUserInfo] = React.useState({
        fullname: "",
        phone: "",
        email: "",
        demand: "",
        nameCompany: ""
    })

    const [errors, setErrors] = useState({
        fullname: false,
        phone: false,
        demand: false
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
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

    const { showSnackbar } = useSnackbar();

    const handleContact = async () => {
        if (!userInfo.fullname.trim() || !userInfo.phone.trim() || !userInfo.demand.trim()) {
            setErrors({
                fullname: !userInfo.fullname.trim(),
                phone: !userInfo.phone.trim(),
                demand: !userInfo.demand.trim(),
            });
            showSnackbar("Vui lòng điền tất cả các trường bắt buộc!");
            return;
        }
        console.log(userInfo);
        try {
            const res = await api.post("/customer/contact", userInfo);
            console.log(res);
            // Kiểm tra nếu request thành công
            if (res.status === 201) {
                console.log(res);
                showSnackbar("Gửi liên hệ thành công");
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error:", error);
            showSnackbar("Gửi liên hệ thất bại!");
        }
    };

    return (
        <Box>
            <iframe style={{ width: "100%" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.577731862711!2d106.7695372142139!3d10.850261760047032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f8d0e993b05%3A0x8abf4c480f8b822b!2zOTcgTWFuIFRoacOqbiwgUGjDuiBIaeG7h3AgSMaw4budYywgbmjhuq10IHPDumMgVHJ1w6JuIFbEg25nLCBWaeG7h3QgTmFt!5e0!3m2!1sen!2s!4v1652520257601!5m2!1sen!2s"
                width="600" height="450" allowFullScreen=""
                loading="lazy" ></iframe>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ width: '80%', margin: '30px' }}>
                        <Typography variant="h5" color='primary' align="center" gutterBottom >Công ty cổ phần bất động sản SkyLand</Typography>
                        <Typography variant="body1" color='textSecondary' marginTop={'30px'} align="justify" paragraph>Được thành lập vào ngày 20/08/2008 với niềm đam mê và khát vọng thành công trong lĩnh vực bất động sản. Nhờ chiến lược rõ ràng và hướng đi đúng, SkyLand đã nhanh chóng phát triển và đạt được những thành công nhất định.</Typography>
                        <Typography variant="body1" color='textSecondary' marginTop={'30px'} align="justify" paragraph>Với hơn 10 năm kinh nghiệm, SkyLand tự hào là sàn mua bán, giao dịch và quảng cáo bất động sản hàng đầu tại Việt Nam</Typography>
                        <Typography variant="body2" color='textSecondary' align="justify" paragraph>46 Man Thiện, TP. Thủ Đức, TP. HCM</Typography>
                        <Typography variant="body2" color='textSecondary' align="justify" paragraph>Hotline: 0922227</Typography>
                        <Typography variant="body2" color='textSecondary' align="justify" paragraph>Email: vsh@gmail.com</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={
                        {
                            width: '60%',
                            margin: '30px auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }
                    } >
                        <Typography variant="h5" color='primary' align="center" gutterBottom >Liên hệ với chúng tôi</Typography>
                        <TextField
                            id="fullname"
                            name="fullname"
                            label="Họ và tên"
                            variant="outlined"
                            value={userInfo.fullname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.fullname}
                            helperText={errors.fullname ? "Tên là bắt buộc" : ""}
                            required
                            fullWidth
                        />
                        <TextField
                            id="phone"
                            name="phone"
                            label="Số điện thoại"
                            variant="outlined"
                            value={userInfo.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.phone}
                            helperText={errors.phone ? "Số điện thoại là bắt buộc" : ""}
                            required
                            fullWidth
                        />
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={userInfo.Email}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            id="demand"
                            name="demand"
                            label="Nội dung cần hỗ trợ"
                            variant="outlined"
                            value={userInfo.demand}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.demand}
                            helperText={errors.demand ? "Nội dung là bắt buộc" : ""}
                            required
                            fullWidth
                        />
                        <TextField
                            id="nameCompany"
                            name="nameCompany"
                            label="Tên công ty"
                            variant="outlined"
                            value={userInfo.nameCompany}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleContact} fullWidth>Gửi liên hệ</Button>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
}

export default Contact;