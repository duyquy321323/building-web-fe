import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const News = () => {
    return (
        <>
            <Typography variant="h4" textAlign={'center'} margin={'40px'} color={'rgb(25, 118, 210)'}>Danh mục tin tức</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '70%',
                margin: '40px auto',
                gap: 4,
                textAlign: 'center'
            }}>
                <img src="https://bizweb.dktcdn.net/thumb/large/100/328/362/articles/vinpearl-ha-long-bay-resort-0.jpg?v=1534491225390" alt="" />
                <Link>Xuất hiện căn hộ cao cấp làm mê mẩn giới
                    thượng lưu</Link>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '70%',
                margin: '40px auto',
                gap: 4,
                textAlign: 'center'
            }}>
                <img src="https://bizweb.dktcdn.net/thumb/large/100/328/362/articles/a7.jpg?v=1534491036947" alt="" />
                <Link>Tiếp tục rà soát, đánh giá những bất cập liên
                    quan đến
                    tích tụ đất đai</Link>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '70%',
                margin: '40px auto',
                gap: 4,
                textAlign: 'center'
            }}>
                <img src="https://bizweb.dktcdn.net/thumb/large/100/328/362/articles/36-1-kmey.jpg?v=1534490952150" alt="" />
                <Link>Hà Nội phê duyệt chỉ giới đường đỏ tuyến
                    đường khu đô
                    thị Gia Lâm tới ga Phú Thị</Link>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '70%',
                margin: '40px auto',
                gap: 4,
                textAlign: 'center'
            }}>
                <img src="https://bizweb.dktcdn.net/thumb/large/100/328/362/articles/a7.jpg?v=1534491036947" alt="" />
                <Link>Chính sách ưu đãi có một không hai khi đầu tư
                    BĐS nghỉ
                    dưỡng tại Khánh Hòa</Link>
            </Box>
        </>
    );
}

export default News;