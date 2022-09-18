import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useTheme, styled } from "@mui/material/styles";

const FooterListItem = styled(ListItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    paddingLeft: 0,
    paddingBottom: 0,
    "&:hover": { textDecoration: "underline" },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
    paddingLeft: 0,
    paddingBottom: 3,
}));

function Footer() {
    const theme = useTheme();
    const userData = useSelector((state) => state.user.userData);

    const footerTextLinks = (
        <Stack
            direction="row"
            spacing={{ xs: 2, mobile: 6, sm: 7 }}
            justifyContent={{ sm: "flex-start", md: "flex-end" }}
        >
            <List dense sx={{ pt: 0 }}>
                <FooterTitle variant="h6">About</FooterTitle>
                <FooterListItem component={RouterLink} to="/about" sx={{ pl: 0 }}>
                    <ListItemText primary="Overview" />
                </FooterListItem>
                <FooterListItem
                    component={Link}
                    href="https://github.com/PeterBohai/snoosdigest"
                    target="_blank"
                    sx={{ pl: 0 }}
                >
                    <ListItemText primary="GitHub" />
                </FooterListItem>
            </List>

            <List dense sx={{ pt: 0 }}>
                <FooterTitle variant="h6">Contact</FooterTitle>
                <FooterListItem
                    component={Link}
                    href="https://github.com/PeterBohai/snoosdigest/issues"
                    target="_blank"
                >
                    <ListItemText primary="GitHub Issues" />
                </FooterListItem>
                <FooterListItem
                    component={Link}
                    href="mailto:support@snoosdigest.com"
                    target="_blank"
                >
                    <ListItemText primary="Email Support" />
                </FooterListItem>
            </List>
            <List dense sx={{ pt: 0 }}>
                <FooterTitle variant="h6">Resources</FooterTitle>
                {userData ? null : (
                    <FooterListItem component={RouterLink} to="/login">
                        <ListItemText primary="Log in" />
                    </FooterListItem>
                )}
                <FooterListItem component={RouterLink} to="/privacy">
                    <ListItemText primary="Privacy Policy" />
                </FooterListItem>
            </List>
        </Stack>
    );

    return (
        // margin-top auto needed to make a sticky footer (along with flexbox column in index.html)
        <footer style={{ marginTop: "auto" }}>
            <Box
                py={{ xs: 5, sm: 7 }}
                mt={{ xs: 7, sm: 10 }}
                bgcolor="footer.main"
                color="text.primary"
                borderTop="1px solid"
                borderColor="footer.secondary"
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
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography
                                variant="h3"
                                component="span"
                                sx={{ letterSpacing: ".1rem" }}
                            >
                                SnoosDigest
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {footerTextLinks}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3, bgcolor: "footer.secondary" }} />

                    <Grid container>
                        <Grid item xs={6} justifyContent="center">
                            <Typography component="span" variant="body2" color="text.secondary">
                                © {new Date().getFullYear()} SnoosDigest
                            </Typography>
                        </Grid>
                        <Grid item xs={6} display="flex" justifyContent="flex-end">
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
