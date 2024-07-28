import { Box, Pagination, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from 'react';
import SwipeableViews from "react-swipeable-views";
import { mod } from 'react-swipeable-views-core';
import { autoPlay, virtualize } from 'react-swipeable-views-utils';

const useStyles = makeStyles({
    slideContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '800px', // Đặt chiều cao phù hợp cho container của ảnh
    },
    slide: {
        width: '80%', // Đặt chiều rộng ảnh là 100% để chiếm hết chiều rộng container
        height: '80%', // Đặt chiều cao ảnh là 100% để chiếm hết chiều cao container
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
});

const AutoPlaySwipeableViews = autoPlay(virtualize(SwipeableViews));

const Home = () => {
    const classes = useStyles();
    const images = [
        {
            url: 'https://media.tapchitaichinh.vn/images/upload/hoangthuviet/04202019/bat-dong-san.jpg'
        },
        {
            url: 'https://richnguyen.vn/wp-content/uploads/2020/08/buc-anh-bat-dong-san-dep-2.jpg'
        },
    ];

    const [page, setPage] = React.useState(1);
    const [index, setIndex] = React.useState(0);

    // Hàm xử lý sự kiện khi người dùng thay đổi trang
    const handleChange = (event, value) => {
        setIndex(index + 1);
        setPage(value);
    };

    // Hàm xử lý sự kiện khi người dùng lướt qua slide
    const handleIndexChange = (index) => {
        console.log(index + ',' + images.length);
        setPage(mod(index, images.length) + 1); // +1 vì trang bắt đầu từ 1, not 0
        setIndex(index);
    };

    // Tạo slide renderer
    const slideRenderer = ({ index, key }) => {
        const imageIndex = mod(index, images.length);
        const image = images[imageIndex];
        return (
            <div key={key} className={classes.slideContainer}>
                <Paper
                    className={classes.slide}
                    style={{ backgroundImage: `url(${image.url})` }}
                />
            </div>
        );
    };

    useEffect(() => {

    }, [])

    return (
        <>
            <img src="https://bizweb.dktcdn.net/100/328/362/themes/894751/assets/slider_1.png?1676257083798" alt="" style={{ width: '100%' }} />
            <AutoPlaySwipeableViews
                enableMouseEvents
                slideRenderer={slideRenderer}
                interval={4000} // Tùy chọn: thời gian giữa các slide (milisecond)
                onChangeIndex={handleIndexChange} // Cập nhật trạng thái khi lướt
                index={index}
            />
            <Box sx={{ display: "flex", justifyContent: 'center' }}>
                <Pagination
                    count={images.length} // Tổng số trang
                    color="primary"
                    page={page} // Trang hiện tại
                    onChange={handleChange} // Cập nhật slide khi người dùng thay đổi trang
                />
            </Box>
        </>
    );
}

export default Home;
