import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const baseUrl = 'http://127.0.0.1:8000/api'

let initialUserData = null
try {
    initialUserData = jwt_decode(localStorage.getItem('access'))
} catch {
}

const userInitialState = {
    userLoginPending: false,
    userError: null,
    userData: initialUserData
}

export const attemptUserLogin = createAsyncThunk('user/attemptLogin', async (loginDetails) => {
    const response = await axios.post(`${baseUrl}/users/login`, {
        'username': loginDetails.email,
        'password': loginDetails.password
    });
    const responseBody = response.data;
    console.log(responseBody);
    localStorage.setItem('access', responseBody.access)
    return response.data
});

const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        'logout': (state) => {
            state.userData = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(attemptUserLogin.pending, (state, action) => {
                state.userLoginPending = true;
            })
            .addCase(attemptUserLogin.fulfilled, (state, action) => {
                state.userLoginPending = false;
                try {
                    state.userData = jwt_decode(action.payload.access);
                } catch {
                    state.userData = null;
                    state.userError = 'InvalidTokenError';
                }
            })
            .addCase(attemptUserLogin.rejected, (state, action) => {
                state.userLoginPending = false;
                state.userData = null;
                state.userError = action.payload || null;
            })
    }
});

export const userActions = userSlice.actions;

export default userSlice.reducer
