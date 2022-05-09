import React, { useEffect, useState } from 'react';
import { Link as RouterLink} from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import PostPreviewCard from '../components/PostPreviewCard';
import apiService from '../services/api';
import configService from '../services/config';
import utilsService from '../services/utils';


function HomeScreen() {
    const [subredditPosts, setSubredditPosts] = useState({});

    useEffect(() => {
        apiService
            .getHomePagePosts('day')
            .then(res => {
                console.log(res.data);
                setSubredditPosts(res.data);
            });
    }, []);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    return (
        <div>
            <Container>
            <ThemeProvider theme={theme}>
                {Object.entries(subredditPosts).map(([subreddit, posts]) => 
                    <Box sx={{pt: 3, pb: 3}} key={subreddit}>
                        <Typography gutterBottom variant='h4' component='h4' color='primary' sx={{fontWeight: 'bold'}}>
                            <Link component={RouterLink} to={`/subreddits/${utilsService.removeSubredditPrefix(subreddit)}`} underline='hover' color='inherit'>
                            {subreddit}
                            </Link>
                        </Typography>
                        <Stack spacing={3}>
                            {posts.map(post => 
                                <PostPreviewCard post={post} key={post.id} />
                            )}
                        </Stack>
                    </Box>
                )}
            </ThemeProvider>
            </Container>
        </div>
    );
}

export default HomeScreen;