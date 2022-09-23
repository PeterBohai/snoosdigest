import React, { useState } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import apiService from "../services/api";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

function AlertPopup({ alertMessage, setMessage }) {
    const handleCloseAlert = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setMessage("");
    };
    return (
        <Snackbar
            open={alertMessage !== ""}
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

function ResetPasswordScreen() {
    const [emailValue, setEmailValue] = useState("");
    const [emailErrorText, setEmailErrorText] = useState("");
    const [emailSentSuccessMessage, setEmailSentSuccessMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const resetPasswordData = new FormData(event.currentTarget);

        apiService
            .postResetUserPasswordEmail(resetPasswordData)
            .then((res) => {
                setEmailSentSuccessMessage(res.data);
                setEmailValue("");
            })
            .catch((err) => {
                const errorData = err.response.data;
                setEmailErrorText(errorData);
                setEmailSentSuccessMessage("");
                setEmailValue("");
            });
    };

    const handleEmailChange = (event) => {
        setEmailValue(event.target.value);
        setEmailErrorText("");
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "info.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Request Password Reset
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
                    <Typography mt={8} mb={5} variant="body1">
                        Please enter your account's email address and we will send you a password
                        reset link.
                    </Typography>
                    <InputLabel
                        htmlFor="username"
                        sx={{ color: "text.primary", fontWeight: "bold", mb: 1 }}
                    >
                        Email
                    </InputLabel>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        autoComplete="email"
                        placeholder="example@email.com"
                        autoFocus
                        error={emailErrorText !== ""}
                        helperText={emailErrorText}
                        color="primary"
                        sx={{ mb: 3 }}
                        value={emailValue}
                        onChange={handleEmailChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                    >
                        Send Password Reset Email
                    </Button>
                </Box>
                <AlertPopup
                    alertMessage={emailSentSuccessMessage}
                    setMessage={setEmailSentSuccessMessage}
                />
            </Box>
        </Container>
    );
}

export default ResetPasswordScreen;
