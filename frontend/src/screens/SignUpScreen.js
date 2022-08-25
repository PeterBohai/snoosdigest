import * as React from "react";
import { useDispatch } from "react-redux";

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
import { attemptUserRegistration } from "../store/userSlice";

let theme = createTheme(configService.baseTheme);
theme = responsiveFontSizes(theme);

function SignUpScreen() {
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
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
        dispatch(attemptUserRegistration(registrationCredentials));
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
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <InputLabel
                                    htmlFor="firstName"
                                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
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
                                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
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
                                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                                >
                                    Email *
                                </InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    placeholder
                                    id="username"
                                    name="email"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel
                                    htmlFor="new-password"
                                    sx={{ color: "black", fontWeight: "bold", mb: 1 }}
                                >
                                    Password *
                                </InputLabel>
                                <TextField
                                    required
                                    fullWidth
                                    placeholder
                                    name="password"
                                    type="password"
                                    id="new-password"
                                    autoComplete="new-password"
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
                        <Link href="/login" variant="body2">
                            Have an account? Log in
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignUpScreen;
