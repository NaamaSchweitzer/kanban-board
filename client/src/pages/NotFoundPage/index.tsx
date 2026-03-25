import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for doesn't exist.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;