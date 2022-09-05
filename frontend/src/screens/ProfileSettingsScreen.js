import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";

import utilsService from "../services/utils";
import apiService from "../services/api";
import store from "../store/index";
import { userActions } from "../store/userSlice";

const SettingsTextField = styled(TextField)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(0.5),
        width: "440px",
        maxWidth: "100%",
    },
    "& .MuiInputBase-input": {
        backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
        padding: "7px 14px",
    },
    "& .MuiOutlinedInput-root": {
        backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    },
}));

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

function SettingsAlert({ open, alertMessage, setOpen }) {
    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
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
                {alertMessage}
            </Alert>
        </Snackbar>
    );
}

function updateUserData(newUserData) {
    let userLocalData = JSON.parse(localStorage.getItem("user"));
    userLocalData = { ...userLocalData, ...newUserData };
    localStorage.setItem("user", JSON.stringify(userLocalData));
    console.log("store.dispatch(userActions.updateUserData(newUserData));");
    store.dispatch(userActions.updateUserData(newUserData));
}

const passwordConditionsText =
    "Password must be 8 or more characters and contain and least one special character";

function ProfileSettingsScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const userData = useSelector((state) => state.user.userData);
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
    const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
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
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePasswordChange = (prop) => (event) => {
        const value = event.target.value;
        setUpdatePasswordValues({ ...updatePasswordValues, [prop]: value });

        if (
            prop === "newPassword" &&
            value !== "" &&
            !utilsService.validatePasswordConditions(value)
        ) {
            setUpdatePasswordErrors({ ...updatePasswordErrors, [prop]: passwordConditionsText });
        } else {
            setUpdatePasswordErrors({ ...updatePasswordErrors, [prop]: "" });
            setNewPasswordError(false);
        }
    };

    const handleProfileChange = (prop) => (event) => {
        setProfileValues({ ...profileValues, [prop]: event.target.value });
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        const profileFormData = new FormData(event.currentTarget);
        const requestData = Object.fromEntries(profileFormData.entries());
        apiService
            .putUserProfile(requestData)
            .then((res) => {
                console.log("Profile was updated:", res.data);
                updateUserData(res.data);
                setUpdateProfileSuccess(true);
            })
            .catch((err) => {
                console.log(err);
                setUpdateProfileSuccess(false);
            });
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const changePasswordFormData = new FormData(event.currentTarget);

        if (!utilsService.validatePasswordConditions(changePasswordFormData.get("newPassword"))) {
            setUpdatePasswordErrors({
                ...updatePasswordErrors,
                newPassword: passwordConditionsText,
            });
            setNewPasswordError(true);
            return;
        }
        if (
            changePasswordFormData.get("newPassword") !==
            changePasswordFormData.get("newPasswordConfirmation")
        ) {
            setUpdatePasswordErrors({
                ...updatePasswordErrors,
                newPasswordConfirmation: "Confirmation password did not match the new password",
            });
            return;
        }
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
                if (errorData.newPassword) {
                    setNewPasswordError(true);
                }
            });
    };

    const handleDeleteAccount = () => {
        apiService
            .deleteUserProfile()
            .then((res) => {
                console.log("Profile was deleted", res.data);
                navigate("/", { replace: true });
                localStorage.removeItem("user");
                dispatch(userActions.logout());
                window.location.reload();
            })
            .catch((err) => {
                console.error("An error occurred while deleting your account", err.response.data);
            });
    };
    const handleCloseDeleteAccountDialog = () => {
        setOpenDeleteAccountDialog(false);
    };

    return (
        <Container
            sx={{
                [theme.breakpoints.down("md")]: {
                    maxWidth: "sm",
                },
                [theme.breakpoints.up("md")]: {
                    maxWidth: "md",
                },
                pt: 3,
                minHeight: "100vh",
            }}
        >
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
            <Box sx={{ width: "100%" }} component="form" onSubmit={handleProfileSubmit}>
                <InputLabel htmlFor="first-name" sx={{ color: "black", fontWeight: "bold" }}>
                    First Name
                </InputLabel>
                <SettingsTextField
                    margin="normal"
                    id="first-name"
                    name="first_name"
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
                    name="last_name"
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

            <Box component="form" onSubmit={handleChangePassword} sx={{ mt: 1 }}>
                <InputLabel htmlFor="old-password" sx={{ color: "black", fontWeight: "bold" }}>
                    Old password *
                </InputLabel>
                <SettingsTextField
                    margin="normal"
                    required
                    id="old-password"
                    name="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={updatePasswordValues.oldPassword}
                    onChange={handleUpdatePasswordChange("oldPassword")}
                    error={updatePasswordErrors.oldPassword !== ""}
                    helperText={updatePasswordErrors.oldPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                    }}
                                    onMouseUp={(event) => {
                                        event.preventDefault();
                                    }}
                                    edge="end"
                                >
                                    {showOldPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <InputLabel htmlFor="new-password" sx={{ color: "black", fontWeight: "bold" }}>
                    New password *
                </InputLabel>
                <SettingsTextField
                    margin="normal"
                    required
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={updatePasswordValues.newPassword}
                    onChange={handleUpdatePasswordChange("newPassword")}
                    error={updatePasswordErrors.newPassword !== "" && newPasswordError}
                    helperText={updatePasswordErrors.newPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                    }}
                                    onMouseUp={(event) => {
                                        event.preventDefault();
                                    }}
                                    edge="end"
                                >
                                    {showNewPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <InputLabel htmlFor="old-password" sx={{ color: "black", fontWeight: "bold" }}>
                    Confirm new password *
                </InputLabel>
                <SettingsTextField
                    margin="normal"
                    required
                    id="new-password-confirm"
                    name="newPasswordConfirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={updatePasswordValues.newPasswordConfirmation}
                    onChange={handleUpdatePasswordChange("newPasswordConfirmation")}
                    error={updatePasswordErrors.newPasswordConfirmation !== ""}
                    helperText={updatePasswordErrors.newPasswordConfirmation}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                    }}
                                    onMouseUp={(event) => {
                                        event.preventDefault();
                                    }}
                                    edge="end"
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <Visibility fontSize="small" />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <br />
                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    color="primary"
                    sx={{ mt: 2, height: "30px" }}
                >
                    Update password
                </Button>
                <SettingsAlert
                    open={updatePasswordSuccess}
                    setOpen={setUpdatePasswordSuccess}
                    alertMessage="Password was updated successfully"
                />
                <SettingsAlert
                    open={updateProfileSuccess}
                    setOpen={setUpdateProfileSuccess}
                    alertMessage="Profile was updated successfully"
                />
            </Box>

            <Typography variant="h5" mt={8} fontWeight="bold" color="secondary">
                Delete Account
            </Typography>
            <Divider sx={{ mt: 2, mb: 4, bgcolor: "grey.500" }} />

            <Box sx={{ mt: 1 }}>
                <Typography variant="body1">
                    Once you delete your account, <strong>there is no going back</strong>. All your
                    current data will be permanently deleted.
                    <br />
                    Please be certain.
                </Typography>
                <br />
                <Button
                    variant="contained"
                    disableElevation
                    color="secondary"
                    sx={{ height: "30px" }}
                    onClick={() => setOpenDeleteAccountDialog(true)}
                >
                    <strong>Delete your account</strong>
                </Button>
                <Dialog
                    open={openDeleteAccountDialog}
                    onClose={handleCloseDeleteAccountDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Are you sure you want to DELETE your account?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography color="secondary">
                                All your current data will be permanently deleted.
                            </Typography>
                            <Typography>
                                Once your account is deleted you will be logged out.
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteAccountDialog} autoFocus>
                            CANCEL
                        </Button>
                        <Button onClick={handleDeleteAccount} color="secondary">
                            DELETE ACCOUNT
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default ProfileSettingsScreen;
