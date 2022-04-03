import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import apiService from '../services/api';
import { useParams } from 'react-router-dom';


function PostDetailScreen() {
    const [post, setPost] = useState({});
    const id = useParams().id;

    useEffect(() => {
        apiService
            .getPost(id)
            .then(res => {
                console.log(res.data);
                setPost(res.data);
            });
    }, [id]);

    return (
        <div>
            <Container>
                <Box sx={{pt: 3, pb: 3}}>
                    <Typography gutterBottom variant='h4' component='h4' sx={{fontWeight: 'bold'}}>
                        {post.title}
                    </Typography>
                    <Typography variant='body1' component='p'>
                        {post.body || post.permalink}
                    </Typography>
                </Box>
            </Container>
        </div>
    );
}

export default PostDetailScreen