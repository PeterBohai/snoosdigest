import jwt_decode from "jwt-decode";

import store from "../store/index";
import { userActions } from "../store/userSlice";

function verifyAccessToken() {
    let userLocalData;
    try {
        userLocalData = JSON.parse(localStorage.getItem("user"));
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
            localStorage.removeItem("access");
            console.log("Token has expired, user logged out");
        }
    } catch {
        // If accessToken is null, then user is not logged in yet. Otherwise, the token is invalid - log out user
        if (accessToken !== null) {
            store.dispatch(userActions.logout());
            localStorage.removeItem("access");
        }
    }
}

const exportedFunctions = {
    verifyAccessToken,
};

export default exportedFunctions;
