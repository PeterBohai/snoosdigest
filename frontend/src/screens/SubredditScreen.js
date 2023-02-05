import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";

import apiService from "../services/api";
import PostPreviewCard from "../components/PostPreviewCard";

const NUM_POSTS = 5;

function SubredditScreen() {
    const theme = useTheme();
    const [posts, setPosts] = useState({ posts: [] });
    const { subreddit } = useParams();
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        setPosts({ posts: [] });
        apiService
            .getTopPosts(subreddit, "day", NUM_POSTS)
            .then((res) => {
                setPosts(res.data);
            })
            .catch((err) => {
                if (err.response) {
                    const error = err.response;
                    console.error(`${error.status} Response - ${JSON.stringify(error.data)}`);
                    setApiError(error.data);
                } else if (err.request) {
                    console.error(`Request made but got no response. Request - ${err.request}`);
                    setApiError("Something is wrong, could not get response.");
                } else {
                    console.error(`There was an issue with the request - ${err.message}`);
                    setApiError("Something is wrong with the request.");
                }
            });
    }, [subreddit]);

    if (apiError) return;

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
            </Container>
        </div>
    );
}

export default SubredditScreen;
