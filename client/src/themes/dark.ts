import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    heightVariants: {
      navBarHeight: string;
      footerHeight: string;
      boardBarHeight: string;
      boardContentHeight: string;
      listHeaderHeight: string;
      listFooterHeight: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    heightVariants: {
      navBarHeight: string;
      footerHeight: string;
      boardBarHeight: string;
      boardContentHeight: string;
      listHeaderHeight: string;
      listFooterHeight: string;
    };
  }
}

const NAV_BAR_HEIGHT = "48px";
const FOOTER_HEIGHT = "64px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${NAV_BAR_HEIGHT} - ${FOOTER_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const LIST_HEADER_HEIGHT = "50px";
const LIST_FOOTER_HEIGHT = "46px";

const darkTheme = createTheme({
  heightVariants: {
    navBarHeight: NAV_BAR_HEIGHT,
    footerHeight: FOOTER_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    listHeaderHeight: LIST_HEADER_HEIGHT,
    listFooterHeight: LIST_FOOTER_HEIGHT,
  },
  palette: {
    mode: "dark",
      primary: {
      light: "#e3f2fd",
      main: "#2196f3",
      dark: "#1e88e5",
      200: "#90caf9",
      800: "#1565c0",
    },
    secondary: {
      light: "#d1c4e9",
      main: "#7c4dff",
      dark: "#651fff",
      200: "#b39ddb",
      800: "#6200ea",
    },
    background: {
      default: "#111936",
      paper: "#212946",
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
      500: "#8492c4",
      600: "#d7dcec",
      700: "#bdc8f0",
      900: "#bdc8f0",
    },
    text: {
      primary: "#bdc8f0",
      secondary: "#8492c4",
      disabled: "#ffffff80"
    },
    // primary: {
    //   main: "#2196f3", //"#5893df",
    // },
    // secondary: {
    //   main: "#673ab7", //"#2ec5d3",
    // },
    // background: {
    //   default: "#1a223f", //"#192231",
    //   paper: "#111936", //"#24344d",
    // },
  },
  typography: {
    fontSize: 13,
    button: {
      textTransform: "none",
    },
  },
  // components: {
  //   // Name of the component
  //   MuiButton: {
  //     styleOverrides: {
  //       // Name of the slot
  //       root: {
  //         // Some CSS
  //         fontSize: '1rem',
  //       },
  //     },
  //   },
  // },
});

export default darkTheme;
