import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";

import utilsService from "../services/utils";
import apiService from "../services/api";

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

const passwordConditionsText =
    "Password must be 8 or more characters and contain and least one special character";

function ResetPasswordConfirmScreen() {
    const navigate = useNavigate();
    const theme = useTheme();
    const userID = useParams().userID;
    const resetToken = useParams().resetToken;
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
    const [updatePasswordValues, setUpdatePasswordValues] = useState({
        newPassword: "",
        newPasswordConfirmation: "",
    });
    const [updatePasswordErrors, setUpdatePasswordErrors] = useState({
        newPassword: "",
        newPasswordConfirmation: "",
    });
    const [newPasswordError, setNewPasswordError] = useState(false);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const resetPasswordData = new FormData(event.currentTarget);

        resetPasswordData.append("userID", userID);
        resetPasswordData.append("resetToken", resetToken);

        if (!utilsService.validatePasswordConditions(resetPasswordData.get("newPassword"))) {
            setUpdatePasswordErrors({
                ...updatePasswordErrors,
                newPassword: passwordConditionsText,
            });
            setNewPasswordError(true);
            return;
        }
        if (
            resetPasswordData.get("newPassword") !==
            resetPasswordData.get("newPasswordConfirmation")
        ) {
            setUpdatePasswordErrors({
                ...updatePasswordErrors,
                newPasswordConfirmation: "Confirmation password did not match the new password",
            });
            return;
        }
        apiService
            .postResetUserPassword(resetPasswordData)
            .then(async (res) => {
                console.info("Password was updated successfully", res);
                setUpdatePasswordSuccess(true);
                setUpdatePasswordValues({
                    newPassword: "",
                    newPasswordConfirmation: "",
                });
                setUpdatePasswordErrors({
                    newPassword: "",
                    newPasswordConfirmation: "",
                });
                await utilsService.sleep(3000);
                navigate("/login", { replace: true });
            })
            .catch((err) => {
                const errorData = err.response.data;
                setUpdatePasswordSuccess(false);
                setUpdatePasswordErrors({
                    newPassword: "",
                    newPasswordConfirmation: "",
                    ...errorData,
                });
                if (errorData.newPassword) {
                    setNewPasswordError(true);
                }
            });
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
            <Typography variant="h3" mt={10}>
                Reset your password
            </Typography>
            <Divider sx={{ mt: 2, mb: 4, bgcolor: "grey.500" }} />

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <InputLabel
                    htmlFor="new-password"
                    sx={{ color: "text.primary", fontWeight: "bold" }}
                >
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
                <InputLabel
                    htmlFor="old-password"
                    sx={{ color: "text.primary", fontWeight: "bold" }}
                >
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
                    color="error"
                    sx={{ mt: 2, height: "30px" }}
                >
                    Reset password
                </Button>
                <SettingsAlert
                    open={updatePasswordSuccess}
                    setOpen={setUpdatePasswordSuccess}
                    alertMessage="Password was reset successfully - redirecting to Login..."
                />
            </Box>
        </Container>
    );
}

export default ResetPasswordConfirmScreen;
