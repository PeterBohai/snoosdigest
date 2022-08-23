import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";

import configService from "../services/config";
import apiService from "../services/api";

let theme = createTheme(configService.baseTheme);
theme = responsiveFontSizes(theme);

const SettingsTextField = styled(TextField)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(0.5),
        width: "440px",
        maxWidth: "100%",
    },
    "& .MuiInputBase-input": {
        backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
        padding: "5px 14px",
    },
}));

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

function ProfileSettingsScreen() {
    const userData = useSelector((state) => state.user.userData);
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
    const [updatePasswordValues, setUpdatePasswordValues] = useState({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
    });
    const [updatePasswordErrors, setUpdatePasswordErrors] = useState({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
    });
    const [profileValues, setProfileValues] = useState({
        first_name: userData.first_name,
        last_name: userData.last_name,
    });

    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setUpdatePasswordSuccess(false);
    };

    const handleUpdatePasswordChange = (prop) => (event) => {
        setUpdatePasswordValues({ ...updatePasswordValues, [prop]: event.target.value });
    };

    const handleProfileChange = (prop) => (event) => {
        setProfileValues({ ...profileValues, [prop]: event.target.value });
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        console.log("handleProfileSubmit");
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const changePasswordFormData = new FormData(event.currentTarget);
        apiService
            .postUpdateUserPassword(changePasswordFormData)
            .then((res) => {
                console.log("Password was updated successfully", res);
                setUpdatePasswordSuccess(true);
                setUpdatePasswordValues({
                    oldPassword: "",
                    newPassword: "",
                    newPasswordConfirmation: "",
                });
                setUpdatePasswordErrors({
                    oldPassword: "",
                    newPassword: "",
                    newPasswordConfirmation: "",
                });
            })
            .catch((err) => {
                const errorData = err.response.data;
                console.log(errorData);
                setUpdatePasswordSuccess(false);
                setUpdatePasswordErrors({
                    oldPassword: "",
                    newPassword: "",
                    newPasswordConfirmation: "",
                    ...errorData,
                });
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ pt: 3, minHeight: "100vh" }}>
                <CssBaseline />
                <Typography variant="h5">Profile Settings</Typography>
                <Divider sx={{ mt: 2, mb: 4, bgcolor: "grey.500" }} />

                <InputLabel htmlFor="user-email" sx={{ color: "black", fontWeight: "bold" }}>
                    Email address
                </InputLabel>
                <SettingsTextField
                    margin="normal"
                    id="user-email"
                    disabled
                    variant="outlined"
                    value={userData["snoosdigest/username"]}
                />
                <Box
                    sx={{ width: "100%" }}
                    component="form"
                    onSubmit={handleProfileSubmit}
                    noValidate
                >
                    <InputLabel htmlFor="first-name" sx={{ color: "black", fontWeight: "bold" }}>
                        First Name
                    </InputLabel>
                    <SettingsTextField
                        margin="normal"
                        id="first-name"
                        variant="outlined"
                        value={profileValues.first_name}
                        onChange={handleProfileChange("first_name")}
                        inputProps={{ maxLength: 150 }}
                    />

                    <InputLabel htmlFor="last-name" sx={{ color: "black", fontWeight: "bold" }}>
                        Last Name
                    </InputLabel>
                    <SettingsTextField
                        margin="normal"
                        id="last-name"
                        variant="outlined"
                        value={profileValues.last_name}
                        onChange={handleProfileChange("last_name")}
                        inputProps={{ maxLength: 150 }}
                    />
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        color="primary"
                        sx={{ mt: 2, height: "30px" }}
                    >
                        Update profile
                    </Button>
                </Box>

                <Typography variant="h5" mt={8}>
                    Change Password
                </Typography>
                <Divider sx={{ mt: 2, mb: 4, bgcolor: "grey.500" }} />

                <Box component="form" onSubmit={handleChangePassword} noValidate sx={{ mt: 1 }}>
                    <InputLabel htmlFor="old-password" sx={{ color: "black", fontWeight: "bold" }}>
                        Old password
                    </InputLabel>
                    <SettingsTextField
                        margin="normal"
                        required
                        id="old-password"
                        name="oldPassword"
                        type="password"
                        value={updatePasswordValues.oldPassword}
                        onChange={handleUpdatePasswordChange("oldPassword")}
                        error={updatePasswordErrors.oldPassword !== ""}
                        helperText={updatePasswordErrors.oldPassword}
                    />
                    <InputLabel htmlFor="new-password" sx={{ color: "black", fontWeight: "bold" }}>
                        New password
                    </InputLabel>
                    <SettingsTextField
                        margin="normal"
                        required
                        id="new-password"
                        name="newPassword"
                        type="password"
                        value={updatePasswordValues.newPassword}
                        onChange={handleUpdatePasswordChange("newPassword")}
                        error={updatePasswordErrors.newPassword !== ""}
                        helperText={updatePasswordErrors.newPassword}
                    />
                    <InputLabel htmlFor="old-password" sx={{ color: "black", fontWeight: "bold" }}>
                        Confirm new password
                    </InputLabel>
                    <SettingsTextField
                        margin="normal"
                        required
                        id="new-password-confirm"
                        name="newPasswordConfirmation"
                        type="password"
                        value={updatePasswordValues.newPasswordConfirmation}
                        onChange={handleUpdatePasswordChange("newPasswordConfirmation")}
                        error={updatePasswordErrors.newPasswordConfirmation !== ""}
                        helperText={updatePasswordErrors.newPasswordConfirmation}
                    />
                    <br />
                    <Button
                        type="submit"
                        variant="outlined"
                        disableElevation
                        color="secondary"
                        sx={{ mt: 2, height: "30px" }}
                    >
                        Update password
                    </Button>
                    <Snackbar
                        open={updatePasswordSuccess}
                        autoHideDuration={7000}
                        onClose={handleCloseAlert}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        TransitionComponent={SlideTransition}
                    >
                        <Alert
                            onClose={handleCloseAlert}
                            severity="success"
                            sx={{ width: "100%" }}
                            variant="filled"
                        >
                            Password was updated successfully
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default ProfileSettingsScreen;
