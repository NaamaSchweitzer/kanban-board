import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Box
        sx={{
          pt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: (theme) =>
            `calc(100vh - ${theme.heightVariants.navBarHeight} - ${theme.heightVariants.footerHeight})`,
        }}
      >
        <Typography variant="h5">Profile</Typography>
        {user && <Typography variant="h5"> {user.username}</Typography>}
      </Box>
    </Container>
  );
};

export default Profile;
