import jwt_decode from "jwt-decode";

import store from "../store/index";
import { userActions } from "../store/userSlice";

function verifyAccessToken() {
    let userLocalData = localStorage.getItem("user");
    if (!userLocalData) {
        return;
    }
    try {
        userLocalData = JSON.parse(userLocalData);
    } catch {
        return;
    }
    const accessToken = userLocalData.access;
    try {
        const decodedToken = jwt_decode(accessToken);
        const currentDate = new Date();

        // Token is expired
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            store.dispatch(userActions.logout());
            localStorage.removeItem("user");
            console.log("Token has expired, user logged out");
        }
    } catch {
        // If accessToken is null, then user is not logged in yet. Otherwise, the token is invalid - log out user
        if (accessToken !== null) {
            store.dispatch(userActions.logout());
            localStorage.removeItem("user");
        }
    }
}

const exportedFunctions = {
    verifyAccessToken,
};

export default exportedFunctions;
