import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import themeService from "./services/theme";
import App from "./App";

function AppContainer() {
    const darkMode = useSelector((state) => state.theme.darkMode);
    const theme = themeService.getTheme(darkMode ? "dark" : "light");

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <App />
            </ThemeProvider>
        </Router>
    );
}

export default AppContainer;
