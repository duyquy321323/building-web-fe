import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <Typography variant="h2">Oops, 401!</Typography>
                <Typography variant="h3">401 Unauthorized</Typography>
                <Button variant="contained" sx={{ margin: '50px', width: '20%' }}>Cần hỗ trợ?</Button>
                <Link to={'/home'}>Quay lại trang chủ</Link>
            </Box >
        </>
    );
}
export default Unauthorized;