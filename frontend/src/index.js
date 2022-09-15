import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "./index.css";
import store from "./store/index";
import AppWrapper from "./AppWrapper";

const root = createRoot(document.getElementById("root"));

if (process.env.DJANGO_SETTINGS_MODULE === "snoosdigest.settings.production") {
    // Disable console.info in production environment
    console.info = () => {};
}

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AppWrapper />
        </Provider>
    </React.StrictMode>
);
