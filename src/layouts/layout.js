import { styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";

const LayoutContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column'
});

const HeaderContainer = styled('div')({
    height: 'auto'
});

const ContentContainer = styled('div')({
    minHeight: '680px',
    flex: '1',
    paddingBottom: '100px'
});

const FooterContainer = styled('div')({
    minHeight: '200px'
});

const Layout = ({ isLoggedIn }) => {
    return (
        <LayoutContainer>
            <HeaderContainer >
                <Header isLoggedIn={isLoggedIn} />
            </HeaderContainer>
            <ContentContainer>
                <Outlet />
            </ContentContainer>
            <FooterContainer >
                <Footer />
            </FooterContainer>
        </LayoutContainer>
    );
};

export default Layout;
