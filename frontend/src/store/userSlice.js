import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";

import apiService from "../services/api";

const baseUrl = "/api";

function setUserData(jwtAccessToken) {
    try {
        const userData = jwt_decode(jwtAccessToken);
        userData.access = jwtAccessToken;
        return userData;
    } catch {
        return null;
    }
}

const userInitialState = {
    userLoginPending: false,
    userError: null,
    userData: setUserData(localStorage.getItem("access")),
    subscriptions: [],
};

export const attemptUserLogin = createAsyncThunk("user/attemptLogin", async (loginDetails) => {
    const response = await axios.post(`${baseUrl}/users/login`, {
        username: loginDetails.email,
        password: loginDetails.password,
    });
    const responseBody = response.data;
    console.log(responseBody);
    localStorage.setItem("access", responseBody.access);
    return responseBody;
});

export const attemptUserRegistration = createAsyncThunk(
    "user/attemptRegister",
    async (registerDetails) => {
        const response = await axios.post(`${baseUrl}/users/register`, {
            firstName: registerDetails.firstName,
            lastName: registerDetails.lastName,
            email: registerDetails.email,
            password: registerDetails.password,
        });
        const responseBody = response.data;
        console.log(responseBody);
        localStorage.setItem("access", responseBody.access);
        return responseBody;
    }
);

export const updateUserSubscriptions = createAsyncThunk("user/updateSubscriptions", async () => {
    const response = await apiService.getUserSubscriptions();
    const responseBody = response.data;
    console.log(responseBody);
    return responseBody;
});

const userSlice = createSlice({
    name: "user",
    initialState: userInitialState,
    reducers: {
        logout: (state) => {
            state.userData = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(attemptUserLogin.pending, (state, action) => {
                state.userLoginPending = true;
            })
            .addCase(attemptUserLogin.fulfilled, (state, action) => {
                state.userLoginPending = false;
                try {
                    state.userData = setUserData(action.payload.access);
                } catch {
                    state.userData = null;
                    state.userError = "InvalidTokenError";
                }
            })
            .addCase(attemptUserLogin.rejected, (state, action) => {
                state.userLoginPending = false;
                state.userData = null;
                state.userError = action.payload || null;
            })
            .addCase(updateUserSubscriptions.fulfilled, (state, action) => {
                state.subscriptions = action.payload;
            })
            .addCase(updateUserSubscriptions.rejected, (state, action) => {
                state.userError = action.payload || null;
            })
            .addCase(attemptUserRegistration.pending, (state, action) => {
                state.userLoginPending = true;
            })
            .addCase(attemptUserRegistration.fulfilled, (state, action) => {
                state.userLoginPending = false;
                try {
                    state.userData = setUserData(action.payload.access);
                } catch {
                    state.userData = null;
                    state.userError = "InvalidTokenError";
                }
            })
            .addCase(attemptUserRegistration.rejected, (state, action) => {
                state.userLoginPending = false;
                state.userData = null;
                state.userError = action.payload || null;
            });
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
