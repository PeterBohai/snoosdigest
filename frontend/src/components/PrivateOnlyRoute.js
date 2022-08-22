import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateOnlyRoute({ children }) {
    const userData = useSelector((state) => state.user.userData);
    return userData ? children : <Navigate to="/" replace />;
}

export default PrivateOnlyRoute;
