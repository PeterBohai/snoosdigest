import jwt_decode from "jwt-decode";

import store from '../store/index';
import { userActions } from '../store/userSlice';

function verifyAccessToken() {
    const accessToken = localStorage.getItem('access');
    try  {
        const decodedToken = jwt_decode(accessToken);
        const currentDate = new Date();
        console.log(`${new Date().toLocaleString()} Decoded token:`, decodedToken);
        
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            // Token is expired
            store.dispatch(userActions.logout());
            localStorage.removeItem('access');
            console.log('Token has expired, user logged out');
            return;
        } 
    } catch {
        // If the accessToken is null, then user is not logged in yet
        if (accessToken !== null) {
            // Invalid token
            store.dispatch(userActions.logout());
            localStorage.removeItem('access');
        } 
    }
}

const exportedFunctions = {
    verifyAccessToken,
};

export default exportedFunctions;
