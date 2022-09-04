import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "./index.css";
import store from "./store/index";
import App from "./App";
import configService from "./services/config";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme(configService.baseTheme("light"));
theme = responsiveFontSizes(theme);

const root = createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router>
                    <App />
                </Router>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
