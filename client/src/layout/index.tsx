import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  const location = useLocation();
  const isBoardPage = location.pathname.startsWith("/dashboard");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box sx={{ flex: 1 }}>
        {/* Only page content is constrained */}
        <Container sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>

      {!isBoardPage && <Footer />}
    </Box>
  );
};

export default Layout;
