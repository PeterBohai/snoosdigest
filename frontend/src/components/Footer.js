import React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useTheme } from "@mui/material/styles";

function Footer() {
    const theme = useTheme();
    return (
        // margin-top auto needed to make a sticky footer (along with flexbox column in index.html)
        <footer style={{ marginTop: "auto" }}>
            <Box
                py={{ xs: 5, sm: 7 }}
                mt={{ xs: 7, sm: 10 }}
                bgcolor="grey.50"
                color="black"
                borderTop="1px solid"
                borderColor="grey.200"
            >
                <Container
                    sx={{
                        [theme.breakpoints.down("md")]: {
                            maxWidth: "sm",
                        },
                        [theme.breakpoints.up("md")]: {
                            maxWidth: "md",
                        },
                    }}
                >
                    <Typography
                        variant="h5"
                        component="span"
                        sx={{
                            letterSpacing: ".1rem",
                            color: "black",
                        }}
                    >
                        SnoosDigest
                    </Typography>
                    <Divider sx={{ my: 3, bgcolor: "grey.50" }} />
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography component="p" variant="body2" color="text.secondary">
                                © {new Date().getFullYear()} SnoosDigest
                            </Typography>
                        </Grid>
                        <Grid item xs={6} display="flex" justifyContent="end">
                            <Stack direction="row" spacing={2}>
                                <Link
                                    href="https://github.com/PeterBohai"
                                    target="_blank"
                                    color="inherit"
                                    sx={{
                                        "&:hover": {
                                            color: "grey.700",
                                        },
                                    }}
                                >
                                    <GitHubIcon />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/peterbohai"
                                    target="_blank"
                                    color="inherit"
                                    sx={{
                                        "&:hover": {
                                            color: "grey.700",
                                        },
                                    }}
                                >
                                    <LinkedInIcon />
                                </Link>
                                <Link
                                    href="https://twitter.com/PeterBohai"
                                    target="_blank"
                                    color="inherit"
                                    sx={{
                                        "&:hover": {
                                            color: "grey.700",
                                        },
                                    }}
                                >
                                    <TwitterIcon />
                                </Link>
                                <Link
                                    href="https://www.youtube.com/channel/UC0hD-WYOogWBPt1Q0OiLAPw"
                                    target="_blank"
                                    color="inherit"
                                    sx={{
                                        "&:hover": {
                                            color: "grey.700",
                                        },
                                    }}
                                >
                                    <YouTubeIcon />
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </footer>
    );
}

export default Footer;
