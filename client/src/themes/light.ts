import { createTheme } from "@mui/material";

const NAV_BAR_HEIGHT = "48px";
const FOOTER_HEIGHT = "64px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${NAV_BAR_HEIGHT} - ${FOOTER_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const LIST_HEADER_HEIGHT = "50px";
const LIST_FOOTER_HEIGHT = "46px";

const lightTheme = createTheme({
  heightVariants: {
    navBarHeight: NAV_BAR_HEIGHT,
    footerHeight: FOOTER_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    listHeaderHeight: LIST_HEADER_HEIGHT,
    listFooterHeight: LIST_FOOTER_HEIGHT,
  },
  palette: {
    mode: "light",
    primary: {
      light: "#e3f2fd",
      main: "#2196f3",
      dark: "#1e88e5",
      200: "#90caf9",
      800: "#1565c0",
    },
    secondary: {
      light: "#ede7f6",
      main: "#673ab7",
      dark: "#5e35b1",
      200: "#b39ddb",
      800: "#4527a0",
    },
    background: {
      default: "#ffffff",
      // paper: "#ffffff",
    },
    success: {
      light: "#b9f6ca",
      main: "#00e676",
      dark: "#00c853",
      200: "#69f0ae",
    },
    error: {
      light: "#ef9a9a",
      main: "#f44336",
      dark: "#c62828",
    },
    warning: {
      light: "#fff8e1",
      main: "#ffe57f",
      dark: "#ffc107",
    },
    grey: {
      50: "#f8fafc",
      100: "#eef2f6",
      500: "#697586",
      600: "#4b5565",
      700: "#364152",
      900: "#121926",
    },
    text: {
      primary: "#364152",
      secondary: "#697586",
    },
  },
  typography: {
    fontSize: 13,
    button: {
      textTransform: "none",
    },
  },
});

export default lightTheme;
