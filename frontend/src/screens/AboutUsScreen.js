import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";

function AboutUsScreen() {
    const theme = useTheme();
    const snooArticleURL =
        "https://www.adweek.com/brand-marketing/how-alien-doodle-became-reddits-simple-versatile-logo-166848/";
    return (
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
            <CssBaseline />
            <Box my={7}>
                <Grid container>
                    <Grid item xs={12} sm={9} md={7}>
                        <Typography variant="h2">Welcome to SnoosDigest</Typography>
                        <Typography variant="h5" color="text.secondary">
                            Catch up, get informed - all in one quick bite
                        </Typography>
                        <Typography variant="body1" mt={5}>
                            SnoosDigest is a place where you can browse through crowdsourced content
                            and get just the most popular articles or posts of the day. Users can
                            subscribe to their favorite communities (subreddits) - ready to be
                            digested at a glance.
                        </Typography>
                        <Typography variant="body1" mt={5}>
                            Quickly catch up on the top posts in the morning, after a long day, or
                            during the hustle and bustle of the day. With a minimalist design in
                            mind, this is also a place where you can focus on just the content - no
                            distractions.
                        </Typography>
                    </Grid>
                </Grid>

                <Typography variant="h3" mt={10}>
                    How it started
                </Typography>
                <Typography variant="body1" mt={2}>
                    The motivation behind this unique space began with
                </Typography>
                <Typography variant="body1" mt={2}>
                    <strong>A Problem</strong> with mindless scrolling on Reddit looking for good
                    posts and sorting by top per subreddit was just too tedious.
                </Typography>
                <Typography variant="body1" mt={0}>
                    <strong>A Desire</strong> for a clean, clutter-free interface to browse through
                    the top posts of just my favorite subreddits
                </Typography>
                <Typography variant="body1" mt={2}>
                    The result was SnoosDigest. The name? A play on{" "}
                    <Link href="https://reddit.com/" target="_blank">
                        Reddit
                    </Link>
                    's cute alien mascot (
                    <Link href={snooArticleURL} target="_blank">
                        Snoo
                    </Link>
                    ) and the old "Reader's Digest" I remember seeing on the bookshelves of
                    supermarkets and libraries growing up.
                </Typography>
            </Box>
        </Container>
    );
}

export default AboutUsScreen;
