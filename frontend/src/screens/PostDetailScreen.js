import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import LaunchIcon from '@mui/icons-material/Launch';
import Skeleton from '@mui/material/Skeleton';
import ForwardIcon from '@mui/icons-material/Forward';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import CommentCard from '../components/CommentCard';
import apiService from '../services/api';
import utilsService from '../services/utils';
import configService from '../services/config';

function PostDetailScreen() {
    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);
    const id = useParams().id;

    useEffect(() => {
        apiService.getPost(id).then((res) => {
            const postData = res.data;
            console.log(postData);
            setPost(postData);
            setPostComments(postData.comments);
        });
    }, [id]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    const botTopPadding = 8;
    const sidePadding = 5;

    const postContent = (post) => {
        if (Object.keys(post).length === 0) {
            return '';
        }
        if (post.img_url.length !== 0) {
            return <img src={post.img_url} alt="" />;
        }
        if (post.video_url.length !== 0) {
            return <CardMedia component="video" image={post.video_url} controls />;
        }
        if (utilsService.isValidHttpUrl(post.body)) {
            return (
                <Link href={post.body} target="_blank">
                    {post.body}
                </Link>
            );
        }
        return <Markdown options={configService.markdownBaseOptions}>{post.body}</Markdown>;
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ pt: 3, my: botTopPadding, px: sidePadding, whiteSpace: 'pre-line' }}>
                <ThemeProvider theme={theme}>
                    {/* POST SECTION */}
                    {Object.keys(post).length === 0 ? (
                        <Box>
                            <Skeleton variant="text" width={'80%'} height={80} />
                            <Skeleton variant="rectangular" height={200} />
                            <Skeleton variant="text" width={'40%'} height={60} />
                        </Box>
                    ) : (
                        <Box>
                            <Typography
                                variant="h2"
                                component="h1"
                                fontFamily={'Palatino, Times New Roman, Times, serif'}
                            >
                                {post.title}
                            </Typography>
                            <Typography variant="subtitle1" color="discrete.main">
                                {utilsService.getRelativeTime(post.created_utc)} by{' '}
                                {post.author_name}
                            </Typography>

                            <Typography variant="body1" component="p" sx={{ my: 3 }}>
                                {postContent(post)}
                            </Typography>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                                spacing={2}
                            >
                                <Grid
                                    container
                                    direction="row"
                                    alignItems="center"
                                    maxWidth={'5.2rem'}
                                >
                                    <Grid item sx={{ ml: -1 }}>
                                        <ForwardIcon
                                            color="primary"
                                            sx={{ transform: 'rotate(-90deg)', fontSize: 26 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" fontWeight="bold">
                                            {utilsService.formatNumber(post.upvotes)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item sx={{ mb: -0.5, mr: 0.5 }}>
                                        <ChatBubbleIcon color="action" sx={{ fontSize: 20 }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            variant="body1"
                                            color="discrete.main"
                                            fontWeight="500"
                                        >
                                            {utilsService.formatNumber(post.num_comments)} Comments
                                        </Typography>
                                    </Grid>
                                    <Button
                                        href={post.reddit_url}
                                        startIcon={<LaunchIcon />}
                                        target="_blank"
                                        color="discrete"
                                        sx={{ ml: 2 }}
                                        size="large"
                                    >
                                        Reddit
                                    </Button>
                                </Grid>
                            </Stack>
                        </Box>
                    )}

                    <Typography variant="h5" sx={{ mt: 5 }} fontWeight="bold">
                        Top Comments
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />

                    {/* COMMENT SECTION */}
                    <Box>
                        <Stack spacing={2}>
                            {(postComments.length === 0 ? [...Array(5)] : postComments).map(
                                (comment, index) =>
                                    comment ? (
                                        <>
                                            <CommentCard comment={comment} key={index} />
                                            <Divider sx={{ p: 0, mt: '0 !important' }} />
                                        </>
                                    ) : (
                                        <Skeleton variant="rectangular" height={100} key={index} />
                                    )
                            )}
                        </Stack>
                    </Box>
                </ThemeProvider>
            </Box>
        </Container>
    );
}

export default PostDetailScreen;
