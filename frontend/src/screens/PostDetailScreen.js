import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import apiService from '../services/api';
import CommentCard from '../components/CommentCard';


function PostDetailScreen() {
    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);
    const id = useParams().id;

    useEffect(() => {
        apiService
            .getPost(id)
            .then(res => {
                const postData = res.data;
                console.log(postData);
                setPost(postData);
                setPostComments(postData.comments);
            });
    }, [id]);

    let theme = createTheme({
        typography: {
          body1: {
            fontSize: '1.2rem'
          },
          h4: {
              fontWeight: 500
          }
        },
      });

    theme = responsiveFontSizes(theme);

    const botTopPadding = 8;
    const sidePadding = 5;

    return (
        <Container>
            <Box sx={{py: botTopPadding, pr: sidePadding, whiteSpace: 'pre-line'}}>
                <ThemeProvider theme={theme}>
                    {/* Post Section */}
                    <Box sx={{pl: sidePadding}}>
                        <Typography gutterBottom variant='h4' component='h1'>
                            {post.title}
                        </Typography>
                    
                        <Typography variant='body1' component='p'>
                        {post.body || post.permalink} 
                        </Typography>
                    </Box>

                    <Divider sx={{mt: 5, mb: 5}}/>

                    {/* Comments Section */}
                    <Box>
                        <Stack spacing={2}>
                            {postComments.map(comment => 
                                <CommentCard comment={comment} key={comment.id} sidePadding={sidePadding} />
                            )}
                        </Stack>
                    </Box>
                </ThemeProvider>
            </Box>
        </Container>
    );
}

export default PostDetailScreen