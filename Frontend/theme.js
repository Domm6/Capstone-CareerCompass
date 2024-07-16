import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#546e7a", // Neutral grey for primary color
    },
    secondary: {
      main: "#ffab00", // Accent color
    },
    background: {
      default: "#f5f5f5", // Light grey background for modern look
      paper: "#ffffff", // White background for paper elements
    },
    text: {
      primary: "#212121", // Dark grey text color
      secondary: "#757575", // Medium grey text color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
      letterSpacing: "-0.01562em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
      letterSpacing: "-0.00833em",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 400,
      letterSpacing: "0em",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
      letterSpacing: "0.00735em",
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
      letterSpacing: "0em",
      lineHeight: 1.6,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "0.0075em",
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.00938em",
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.00714em",
      lineHeight: 1.57,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.03125em",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      letterSpacing: "0.01786em",
      lineHeight: 1.43,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.125em",
      lineHeight: 1.75,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      letterSpacing: "0.03333em",
      lineHeight: 1.66,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      letterSpacing: "0.08333em",
      lineHeight: 2.66,
    },
  },
  spacing: 8, // Default spacing of 8px
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for buttons
          textTransform: "none", // Disable uppercase transformation for button text
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: 16, // Default padding for paper components
          borderRadius: 8, // Rounded corners for paper components
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 16, // Default padding for card components
          borderRadius: 8, // Rounded corners for card components
          boxShadow: "0 3px 5px 2px rgba(105, 135, 255, .3)", // Subtle shadow for cards
        },
      },
    },
  },
});

export default theme;
