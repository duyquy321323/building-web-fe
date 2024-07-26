import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[400],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="h6" align="center" gutterBottom>
                    Building Website
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Mạng xã hội
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <IconButton aria-label="facebook" href="https://facebook.com">
                        <FacebookIcon />
                    </IconButton>
                    <IconButton aria-label="twitter" href="https://twitter.com">
                        <TwitterIcon />
                    </IconButton>
                    <IconButton aria-label="instagram" href="https://instagram.com">
                        <InstagramIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                    {'© '}
                    <Link color="inherit" href="https://mui.com/">
                        Building Website
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
