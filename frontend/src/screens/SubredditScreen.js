import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import apiService from '../services/api';
import PostPreviewCard from '../components/PostPreviewCard';
import configService from '../services/config';


function SubredditScreen() {
    const [posts, setPosts] = useState({posts: []});
    const subreddit = useParams().subreddit;

    useEffect(() => {
        apiService
            .getTopPosts(subreddit, 'day', 5)
            .then(res => {
                console.log(res.data);
                setPosts(res.data);
            });
    }, [subreddit]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    return (
        <div>
            <Container>
            <ThemeProvider theme={theme}>
                <Box sx={{pt: 3, pb: 3}} key={subreddit}>
                    <Typography gutterBottom variant='h4' component='h4' color='primary' sx={{fontWeight: 'bold'}}>
                        {posts.subreddit_name}
                    </Typography>
                    
                    <Stack spacing={3}>
                        {posts.posts.map(post => 
                            <PostPreviewCard post={post} key={post.id} />
                        )}
                    </Stack>
                </Box>
            </ThemeProvider>
            </Container>
        </div>
    );
}

export default SubredditScreen;