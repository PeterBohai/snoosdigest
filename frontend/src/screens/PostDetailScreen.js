import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import apiService from '../services/api';
import utilsService from '../services/utils';
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
                        <Typography variant='h4' component='h1'>
                            {post.title}
                        </Typography>
                        <Typography variant='subtitle1' color='text.secondary'>
                            {utilsService.getRelativeTime(post.created_utc)} by {post.author}
                        </Typography>
                    
                        <Typography variant='body1' component='p' sx={{my: 3}}>
                            {utilsService.isValidHttpUrl(post.body) 
                                ? <Link href={post.body} target='_blank'>{post.body}</Link>
                                : post.body
                            }
                        </Typography>

                        <Grid container direction='row' alignItems='center' sx={{ml: - 1.1}}>
                            <Grid item>
                                <ArrowDropUpIcon color='action' sx={{fontSize: 32}} />
                            </Grid>
                            <Grid item>
                                <Typography variant='subtitle1' color='text.secondary' fontWeight='bold'>
                                    {post.upvotes}
                                </Typography>
                            </Grid>
                            <Button href={post.url} target='_blank' sx={{ml: 2}}>Post Link</Button>
                        </Grid>
                    </Box>

                    <Typography variant='h6' sx={{pl: sidePadding, mt: 5}}>
                        TOP COMMENTS
                    </Typography>
                    <Divider sx={{ml: sidePadding, mb: 5}}/>

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