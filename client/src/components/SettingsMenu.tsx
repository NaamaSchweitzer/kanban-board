import {
  Box,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";

const SettingsMenu = () => {
  const { themeMode, toggleTheme } = useTheme();

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTheme: string | null,
  ) => {
    if (newTheme !== null && newTheme !== themeMode) {
      toggleTheme();
    }
  };

  return (
    <Box
      sx={{
        height: (theme) =>
          `calc(100vh - ${theme.heightVariants.navBarHeight} - ${theme.heightVariants.footerHeight})`,
        py: 4,
        px: 10,
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ ml: 3 }}>
        Settings
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Theme Mode */}
      <Grid container>
        <Grid size={12}>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="textSecondary"
          >
            Mode
          </Typography>
        </Grid>
        <Grid size={12}>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={themeMode}
            onChange={handleChange}
            aria-labelledby="settings-mode"
          >
            <ToggleButton value="light" aria-label="light theme">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LightMode />
                <Typography>Light</Typography>
              </Box>
            </ToggleButton>

            <ToggleButton value="dark" aria-label="dark theme">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DarkMode />
                <Typography>Dark</Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsMenu;
