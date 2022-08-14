import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import apiService from '../services/api';
import PostPreviewCard from '../components/PostPreviewCard';
import configService from '../services/config';

const NUM_POSTS = 5;

function SubredditScreen() {
    const [posts, setPosts] = useState({ posts: [] });
    const subreddit = useParams().subreddit;

    useEffect(() => {
        setPosts({ posts: [] });
        apiService.getTopPosts(subreddit, 'day', NUM_POSTS).then((res) => {
            setPosts(res.data);
        });
    }, [subreddit]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    return (
        <div>
            <Container maxWidth="md">
                <ThemeProvider theme={theme}>
                    <Box sx={{ pt: 3, pb: 3 }} key={subreddit}>
                        {posts.posts.length === 0 ? (
                            <Skeleton variant="text" width={210} height={64} />
                        ) : (
                            <Typography
                                gutterBottom
                                variant="h4"
                                component="h4"
                                color="primary"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {posts.subreddit_name}
                            </Typography>
                        )}

                        <Stack spacing={3}>
                            {(posts.posts.length === 0 ? [...Array(NUM_POSTS)] : posts.posts).map(
                                (post, index) =>
                                    post ? (
                                        <PostPreviewCard post={post} key={index} />
                                    ) : (
                                        <Skeleton variant="rectangular" height={168} key={index} />
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
