import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import utilsService from "../services/utils";
import { attemptUserRegistration } from "../store/userSlice";

const passwordConditionsText =
    "Password must be 8 or more characters and contain and least one special character";

function SignUpScreen() {
    const dispatch = useDispatch();
    const [emailErrorText, setEmailErrorText] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordHelperText, setPasswordHelperText] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!utilsService.validatePasswordConditions(data.get("password"))) {
            setPasswordHelperText(passwordConditionsText);
            setPasswordError(true);
            return;
        }
        const registrationCredentials = {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            password: data.get("password"),
        };
        console.log({
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
        });
        try {
            await dispatch(attemptUserRegistration(registrationCredentials)).unwrap();
        } catch (rejectedValueOrSerializedError) {
            setEmailErrorText(rejectedValueOrSerializedError.detail);
        }
    };

    const handlePasswordInputChange = (event) => {
        setPasswordValue(event.target.value);
        if (!utilsService.validatePasswordConditions(event.target.value)) {
            setPasswordHelperText(passwordConditionsText);
        } else {
            setPasswordHelperText("");
            setPasswordError(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    paddingTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "info.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <InputLabel
                                htmlFor="firstName"
                                sx={{ color: "text.primary", fontWeight: "bold", mb: 1 }}
                            >
                                First Name *
                            </InputLabel>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel
                                htmlFor="lastName"
                                sx={{ color: "text.primary", fontWeight: "bold", mb: 1 }}
                            >
                                Last Name *
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel
                                htmlFor="username"
                                sx={{ color: "text.primary", fontWeight: "bold", mb: 1 }}
                            >
                                Email *
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                id="username"
                                name="email"
                                autoComplete="username"
                                error={emailErrorText !== ""}
                                helperText={emailErrorText}
                                onChange={(event) => setEmailErrorText("")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel
                                htmlFor="new-password"
                                sx={{ color: "text.primary", fontWeight: "bold", mb: 1 }}
                            >
                                Password *
                            </InputLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="new-password"
                                autoComplete="new-password"
                                helperText={passwordHelperText}
                                value={passwordValue}
                                onChange={handlePasswordInputChange}
                                error={passwordHelperText !== "" && passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                                onMouseUp={(event) => {
                                                    event.preventDefault();
                                                }}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        color="primary"
                    >
                        Sign Up
                    </Button>
                    <Link to="/login" variant="body2" component={RouterLink}>
                        Have an account? Log in
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default SignUpScreen;
