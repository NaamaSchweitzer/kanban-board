import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  DarkModeOutlined as DarkModeIcon,
  Home as HomeIcon,
  LightModeOutlined as LightModeIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { themeMode, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        color: (theme) =>
          theme.palette.mode === "light" ? "secondary.main" : "text.primary",
      }}
    >
      <Toolbar
        sx={(theme) => ({
          minHeight: theme.heightVariants.navBarHeight,
          display: "flex",
          justifyContent: "space-between",
        })}
      >
        {/* Navigation Links */}
        {isAuthenticated ? (
          <>
            <IconButton component={Link} to="/home" edge="start" color="inherit">
              <HomeIcon />
            </IconButton>
            <Button component={Link} to="/settings" color="inherit">
              Settings
            </Button>
            <Button component={Link} to="/profile" color="inherit">
              Profile
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/register" color="inherit">
              Register
            </Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Toggle Theme Button */}
        <Tooltip
          title={`Switch to ${themeMode === "light" ? "Dark" : "Light"} Mode`}
        >
          <IconButton onClick={toggleTheme} style={{ color: "inherit" }}>
            {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        {isAuthenticated && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
