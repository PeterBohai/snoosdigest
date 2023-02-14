import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import { getHackernewsPosts } from "../services/hackernews";
import PostPreviewCard from "../components/PostPreviewCard";

function HackernewsHome() {
    const [posts, setPosts] = useState([]);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        setPosts([]);
        getHackernewsPosts("best")
            .then((res) => {
                setPosts(res.data);
                console.log(res.data);
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
    }, []);

    if (apiError) return null;

    return (
        <Box>
            <Stack spacing={posts.length === 0 ? 4 : 0}>
                {(posts.length === 0 ? [...Array(5)] : posts).map((postID, index) =>
                    postID ? (
                        <PostPreviewCard postID={postID} key={index} needFetch />
                    ) : (
                        <Skeleton variant="rounded" height={130} key={index} sx={{ mt: 2 }} />
                    )
                )}
            </Stack>
        </Box>
    );
}

export default HackernewsHome;
