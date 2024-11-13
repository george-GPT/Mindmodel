import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontFamily: "Roboto",
    },
    h2: {
      fontWeight: 600,
      fontFamily: "Roboto",
    },
    h3: {
      fontWeight: 600,
      fontFamily: "Roboto",
    },
    h4: {
      fontWeight: 500,
      fontFamily: "Roboto",
    },
    h5: {
      fontWeight: 500,
      fontFamily: "Roboto",
    },
    h6: {
      fontWeight: 500,
      fontFamily: "Roboto",
    },
    body1: {
      fontWeight: 400,
      fontFamily: "Roboto",
    },
    body2: {
      fontWeight: 400,
      fontFamily: "Roboto",
    },
    button: {
      fontWeight: 500,
      fontFamily: "Roboto",
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: "#3442DA",
      100: "#EBEEFF",
      200: "#D4D8FA",
      300: "#96A5EF",
      400: "#5966E8",
      500: "#3442DA",
      600: "#2D39B2",
      700: "#25308A",
      800: "#1C2663",
    },
    secondary: {
      main: "#757575",
      100: "#FFFFFF",
      200: "#F7F7F7",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#757575",
      600: "#212121",
      700: "#000000",
    },
    success: {
      main: "#B5E5B5",
    },
    info: {
      main: "#FFE5B4",
    },
    error: {
      main: "#FFB4B4",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #F9FAFF;
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
        }
      `,
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
