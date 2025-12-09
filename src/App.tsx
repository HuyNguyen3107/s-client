import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";

import QueryProvider from "./libs/query-provider.libs";
import AppRoutes from "./routes/app.routes";
import Toast from "./components/toast.components";
import colors from "./constants/colors";
import PageWrapper from "./components/page-wrapper.components";
import ScrollToTop from "./components/scroll-to-top.components";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.brand.primary,
      dark: colors.brand.secondary,
      contrastText: colors.brand.contrast,
    },
    secondary: {
      main: colors.brand.secondary,
      light: colors.brand.light,
      contrastText: colors.brand.contrast,
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
    background: {
      default: colors.brand.light,
      paper: colors.brand.contrast,
    },
    text: {
      primary: colors.brand.black,
      secondary: colors.brand.secondary,
    },
  },
  typography: {
    fontFamily: ['"UTM-Avo"', '"Barox"', "Arial", "sans-serif"].join(","),
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

function App() {
  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ScrollToTop />
          <PageWrapper>
            <AppRoutes />
          </PageWrapper>
          <Toast />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
