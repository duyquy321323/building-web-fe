import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";

const CardBuilding = ({ CardObject }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`data:image/jpeg;base64,${CardObject.linkOfBuilding}`}
                    alt="Không có ảnh"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {CardObject.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Địa chỉ:</b> {CardObject.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Diện tích thuê:</b> {CardObject.leasedArea}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Giá thuê:</b> {CardObject.rentPrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Phí dịch vụ:</b> {CardObject.brokerageFee}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CardBuilding;