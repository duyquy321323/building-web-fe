import { Box, Typography } from "@mui/material";

const Introduction = () => {
    return (
        <>
            <Box sx={{
                background: `
                    linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 100%),
                    url("http://bizweb.dktcdn.net/100/328/362/themes/894751/assets/bg_breadcrumb.png?1664350964800") no-repeat
                `,
                backgroundBlendMode: 'overlay', // Pha trộn gradient với ảnh nền
                height: '100vh', // Chiều cao của Box
                backgroundSize: 'cover', // Kích thước của ảnh nền
                backgroundPosition: 'center', // Vị trí của ảnh nền
            }}>
                <Typography variant="h3" color={'grey'} align="center" lineHeight={10}> Dev By Duy Quy </Typography>
            </Box>
            <Box sx={{ margin: '30px' }}>
                <Typography variant="body1" color={'grey'}>Tòa nhà cao nhất Việt Nam The Sky Land  90 của Công ty cổ phần công nghệ Sapo chính thức cho khách hàng đặt giữ chỗ chọn mua đợt đầu vào ngày Event <b>1/7/2016</b>. Sự kiện diễn ra lúc 18h tại nhà mẫu Sapohomes Central Park, số 208 đường Nguyễn Chí Thanh, TP Hà Nội .– Đợt đầu đặt chỗ tầng 36 và 37 chỉ dành cho người nước ngoài. Các tầng còn lại tất cả các khách hàng chọn căn đặt cọc từ ngày <b>19/7/2016</b>.</Typography>
                <Typography variant="body1" color={'grey'}>+ Ngày công bố giá bán và cho khách đặt cọc từ: <b>19/7/2016</b></Typography>
                <Typography variant="body1" color={'grey'}>+ Ngày tổ chức event mở bán: <b>25/7/2016</b></Typography>
                <Typography variant="body1" color={'grey'}>– Tòa nhà The Sky Land  90 tầng sở hữu những căn hộ đẳng cấp bậc nhất Việt Nam. Được nhiều các nhà đầu tư trong và ngoài nước đặc biệt quan tâm. Khi mở bán kỳ vọng sẽ trở thành hiện tượng của thị trường bất động sản trong nhiều năm trở lại đây.</Typography>
                <Typography variant="body1" color={'grey'}><b>1. Tổng quan:</b></Typography>
                <Typography variant="body1" color={'grey'}>– Tổng chiều cao thiết kế: 512 m</Typography>
                <Typography variant="body1" color={'grey'}>– Số tầng: 90 tầng nổi và 4 tầng hầm</Typography>
                <Typography variant="body1" color={'grey'}>– Tổng diện tích sàn (không gồm hầm): 198.200 m2</Typography>
                <Typography variant="body1" color={'grey'}><b>2. Diện tích căn hộ Tòa SkyLand 90:</b></Typography>
                <Typography variant="body1" color={'grey'}>– Thiết kế từ: 1-2-3-4 phòng ngủ và Sky villa</Typography>
                <Typography variant="body1" color={'grey'}>– Loại 1 phòng ngủ: 54-55-66 m2</Typography>
                <Typography variant="body1" color={'grey'}>– Loại 2 phòng ngủ: 78-87-90-94 m2</Typography>
                <Typography variant="body1" color={'grey'}>– Loại 3 phòng ngủ: 106-109-133-145 m2</Typography>
                <Typography variant="body1" color={'grey'}>– Loại 4 phòng ngủ: 144-171-172-173-186-192-249-258-269-407-420-431 m2</Typography>
                <Typography variant="body1" color={'grey'}><b>3. Loại hình phát triển The Sky Land  90:</b></Typography>
                <Typography variant="body1" color={'grey'}>– Trung tâm thương mại, rạp chiếu phim, sân trượt băng trong nhà, gym (tầng B1,1, 2, 3)</Typography>
                <Typography variant="body1" color={'grey'}>– Khu club house dành cho cư dân gồm hệ thống hồ bơi, gym, spa, bar và lounge ngoài trời (tầng 4).</Typography>
                <Typography variant="body1" color={'grey'}>– Sảnh lounge tiêu chuẩn 5 sao và nhà sinh hoạt cộng đồng dành cho cư dân, nhà hàng cao cấp (tầng 5).</Typography>
                <Typography variant="body1" color={'grey'}>– Khu căn hộ hiện đại (tầng 6 – 40) với căn hộ 1 – 4 phòng ngủ, sky villa.</Typography>
                <Typography variant="body1" color={'grey'}>– Khách sạn SapoPearl 5 sao (tầng 42 – 76).</Typography>
                <Typography variant="body1" color={'grey'}>– Đài quan sát (tầng 79 – 90).</Typography>
                <Typography variant="body1" color={'grey'}><b>4. Thông tin kỹ thuật:</b></Typography>
                <Typography variant="body1" color={'grey'}>Số lượng căn hộ/sàn: 10 – 20 căn.</Typography>
                <Typography variant="body1" color={'grey'}>Số lượng thang máy: 26 thang máy.</Typography>
                <Typography variant="body1" color={'grey'}>Số lượng thang thoát hiểm: 2 thang.</Typography>
                <Typography variant="body1" color={'grey'}>Chiều rộng hành lang: 1,8m.</Typography>
                <Typography variant="body1" color={'grey'}>Tầng hầm để xe (tầng B2, B3).</Typography>
                <Typography variant="body1" color={'grey'}><b>Thông tin khác:</b></Typography>
                <Typography variant="body1" color={'grey'}><b>– Đơn vị thiết kế: </b>Tập đoàn Atkins (Anh Quốc)</Typography>
                <Typography variant="body1" color={'grey'}><b>– Năm khởi công:</b> 2016</Typography>
                <Typography variant="body1" color={'grey'}><b>– Năm hoàn thành:</b> Dự kiến 2019</Typography>
            </Box>

        </>
    );
}

export default Introduction;