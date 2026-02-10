import { createTheme } from "@mui/material";
// import variables from "./styles/variables.scss";

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
      main: "#2196f3", // variables.primaryColor,
      // light: variables.primaryLight,
      // dark: variables.primaryDark,
    },
    secondary: {
      main: "#673ab7", // variables.secondaryColor,
      // light: variables.secondaryLight,
      // dark: variables.secondaryDark,
    },
    background: {
      default: "#ffffff", // variables.backgroundColor,
      // paper: variables.backgroundColor,
    },
    success: {
      main: "#00e676",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ffe57f",
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
