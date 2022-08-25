import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

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
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";

import configService from "../services/config";
import { attemptUserLogin } from "../store/userSlice";

let theme = createTheme(configService.baseTheme);
theme = responsiveFontSizes(theme);

function LogInScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginCredentials = {
            email: data.get("email"),
            password: data.get("password"),
        };

        try {
            await dispatch(attemptUserLogin(loginCredentials)).unwrap();
            console.log("User was logged in successfully");
            const returnToPath = searchParams.get("return_to");
            if (returnToPath) {
                navigate(returnToPath, { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (rejectedValueOrSerializedError) {
            console.error("Log in dispatch failed: ", rejectedValueOrSerializedError);
        }
    };

    return (
        <ThemeProvider theme={theme}>
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
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: "100%" }}>
                        <InputLabel
                            htmlFor="username"
                            sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                        >
                            Email
                        </InputLabel>
                        <TextField
                            required
                            fullWidth
                            placeholder
                            id="username"
                            name="email"
                            autoComplete="username"
                            autoFocus
                            color="primary"
                            sx={{ mb: 3 }}
                        />

                        <Grid container>
                            <Grid item xs>
                                <InputLabel
                                    htmlFor="current-password"
                                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                                >
                                    Password
                                </InputLabel>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2" underline="none">
                                    Forgot password?
                                </Link>
                            </Grid>
                        </Grid>
                        <TextField
                            required
                            fullWidth
                            placeholder
                            name="password"
                            type="password"
                            id="current-password"
                            autoComplete="current-password"
                            color="primary"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            color="primary"
                        >
                            Log In
                        </Button>
                        <Link href="/signup" variant="body2">
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default LogInScreen;
