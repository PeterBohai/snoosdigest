import { createSlice } from "@reduxjs/toolkit";

const themeInitialState = {
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState: themeInitialState,
    reducers: {
        toggleDarkMode: (state) => {
            console.log("Before", state.darkMode);
            state.darkMode = !state.darkMode;
            console.log("After", state.darkMode);
        },
    },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
