import { Box, Container, CssBaseline, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import colors from "../constants/colors";
import Header from "../components/header.components";
import Footer from "../components/footer.components";

const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default || colors.brand.light,
}));

const MainContent = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

// footer is implemented as a separate component in src/components/footer.components.tsx

const MainLayout: React.FC = () => {
  return (
    <Root>
      <CssBaseline />
      <Header />
      {/* Main content area */}
      <MainContent id="main-content" maxWidth="lg">
        <Outlet />
      </MainContent>
      {/* Footer */}
      <Footer />
    </Root>
  );
};

export default MainLayout;
