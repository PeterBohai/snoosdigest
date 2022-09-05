import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import configService from "./services/config";
import App from "./App";

function AppContainer() {
    const darkMode = useSelector((state) => state.theme.darkMode);
    let theme = createTheme(configService.baseTheme(darkMode ? "dark" : "light"));
    theme = responsiveFontSizes(theme);

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
