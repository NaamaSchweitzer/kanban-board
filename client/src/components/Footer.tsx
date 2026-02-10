import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      sx={(theme) => ({
        height: theme.heightVariants.footerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      })}
    >
      <Typography variant="body2" color="text.secondary">
        © 2026 Kanban Board |&nbsp;
        <MuiLink
          component={RouterLink}
          to="/home"
          color="inherit"
          underline="hover"
        >
          Home
        </MuiLink>{" "}
        |&nbsp;
        <MuiLink
          component={RouterLink}
          to="/settings"
          color="inherit"
          underline="hover"
        >
          Settings
        </MuiLink>{" "}
        |&nbsp;
        <MuiLink
          component={RouterLink}
          to="/profile"
          color="inherit"
          underline="hover"
        >
          Profile
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;
