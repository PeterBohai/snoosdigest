import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "./index.css";
import store from "./store/index";
import AppWrapper from "./AppWrapper";

const root = createRoot(document.getElementById("root"));

const reIsProductionHost = new RegExp("^.*snoosdigest\\..*$");
if (reIsProductionHost.test(window.location.host)) {
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
