import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import apiService from '../services/api';
import PostPreviewCard from '../components/PostPreviewCard';


function HomeScreen() {
    const [posts, setPosts] = useState([]);
    const chosenSubreddit = 'Bogleheads'

    useEffect(() => {
        apiService
            .getTopPosts(chosenSubreddit, 'day', 3)
            .then(res => {
                console.log(res.data);
                setPosts(res.data);
            });
    }, []);

    return (
        <div>
            <Container>
                <Typography gutterBottom variant='h3' component='h3' sx={{mt: 2}}>Popular</Typography>
                <Divider />
                <Box sx={{pt: 3, pb: 3}}>
                    <Typography gutterBottom variant='h4' component='h4' sx={{fontWeight: 'bold'}}>
                        {`r/${chosenSubreddit}`}
                    </Typography>
                    
                    <Stack spacing={3}>
                        {posts.map(post => 
                            <PostPreviewCard post={post} key={post.id} />
                        )}
                    </Stack>
                </Box>
            </Container>
        </div>
    );
}

export default HomeScreen