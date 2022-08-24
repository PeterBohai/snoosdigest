import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateOnlyRoute({ children }) {
    const location = useLocation();
    const userData = useSelector((state) => state.user.userData);

    const returnToPath = encodeURIComponent(location.pathname);
    return userData ? children : <Navigate to={`/login?return_to=${returnToPath}`} replace />;
}

export default PrivateOnlyRoute;
