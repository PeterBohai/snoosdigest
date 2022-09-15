import { createSlice } from "@reduxjs/toolkit";

const themeInitialState = {
    darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState: themeInitialState,
    reducers: {
        toggleDarkMode: (state) => {
            console.info("Before", state.darkMode);
            state.darkMode = !state.darkMode;
            console.info("After", state.darkMode);
        },
    },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
