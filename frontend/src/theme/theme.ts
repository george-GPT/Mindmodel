import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semi-bold
import '@fontsource/inter/700.css'; // Bold

import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
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
    body1: {
      fontWeight: 400,
      fontFamily: "Roboto",
    },
    body2: {
      fontWeight: 400,
      fontFamily: "Roboto",
    },
  },
  palette: {
    primary: {
      main: "#3442DA", // Main
      100: "#EBEEFF", // Lightest
      200: "#D4D8FA", // Very Light
      300: "#96A5EF", // Lighter
      400: "#5966E8", // Light
      500: "#3442DA", // primary
      600: "#2D39B2", // Dark
      700: "#25308A", // Darker
      800: "#1C2663", // Darkest
    },
    secondary: {
      main: "#757575", // Main
      100: "#FFFFFF", // White
      200: "#F7F7F7", // Off White
      300: "#E0E0E0", // Light Grey
      400: "#BDBDBD", // Grey
      500: "#757575", // Main (duplicate for clarity)
      600: "#212121", // Dark Grey
      700: "#000000", // Black
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
          background-color: #F9FAFF; /* Your desired background color */
          paper: '#FFFFFF',
          margin: 0; /* Ensure no default margin */
          padding: 0; /* Ensure no default padding */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400 700;
        }
      `,
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
