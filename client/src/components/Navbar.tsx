import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  DarkModeOutlined as DarkModeIcon,
  Home as HomeIcon,
  LightModeOutlined as LightModeIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext.tsx";

const Navbar = () => {
  const { themeMode, toggleTheme } = useTheme();

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
        <IconButton component={Link} to={"/home"} edge="start" color="inherit">
          <HomeIcon />
        </IconButton>
        <Button component={Link} to={"/settings"} color="inherit">
          Settings
        </Button>
        <Button component={Link} to={"/profile"} color="inherit">
          Profile
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* Toggle Theme Button*/}
        <Tooltip
          title={`Switch to ${themeMode === "light" ? "Dark" : "Light"} Mode`}
        >
          <IconButton onClick={toggleTheme} style={{ color: "inherit" }}>
            {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
