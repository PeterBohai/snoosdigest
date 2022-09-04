import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";

import apiService from "../services/api";
import PostPreviewCard from "../components/PostPreviewCard";
import configService from "../services/config";

const NUM_POSTS = 5;

function SubredditScreen() {
    const [posts, setPosts] = useState({ posts: [] });
    const subreddit = useParams().subreddit;

    useEffect(() => {
        setPosts({ posts: [] });
        apiService.getTopPosts(subreddit, "day", NUM_POSTS).then((res) => {
            setPosts(res.data);
        });
    }, [subreddit]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    return (
        <div>
            <Container
                sx={{
                    [theme.breakpoints.down("lg")]: {
                        maxWidth: "sm",
                    },
                    [theme.breakpoints.up("lg")]: {
                        maxWidth: "md",
                    },
                }}
            >
                <ThemeProvider theme={theme}>
                    <Box sx={{ pt: 3, pb: 3 }} key={subreddit}>
                        {posts.posts.length === 0 ? (
                            <Skeleton variant="text" width={310} height={54} sx={{ mb: 2 }} />
                        ) : (
                            <Typography gutterBottom variant="h3" component="h3" color="primary">
                                {posts.subreddit_name}
                            </Typography>
                        )}
                        <Divider />
                        <Stack spacing={posts.posts.length === 0 ? 4 : 1}>
                            {(posts.posts.length === 0 ? [...Array(NUM_POSTS)] : posts.posts).map(
                                (post, index) =>
                                    post ? (
                                        <PostPreviewCard post={post} key={index} />
                                    ) : (
                                        <Skeleton
                                            variant="rounded"
                                            height={130}
                                            key={index}
                                            sx={{ mt: 2 }}
                                        />
                                    )
                            )}
                        </Stack>
                    </Box>
                </ThemeProvider>
            </Container>
        </div>
    );
}

export default SubredditScreen;
