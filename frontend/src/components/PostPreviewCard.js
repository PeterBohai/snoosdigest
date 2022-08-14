import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ForwardIcon from '@mui/icons-material/Forward';
import OutboundIcon from '@mui/icons-material/Outbound';
import CommentIcon from '@mui/icons-material/Comment';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import utilsService from '../services/utils';
import configService from '../services/config';

function PostPreviewCard({ post }) {
    const contentMaxChars = 320;

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    let postContent = (post) => {
        if (Object.keys(post).length === 0) {
            return '';
        }
        if (post.img_url.length !== 0) {
            return <img src={post.img_url} alt="" />;
        }
        if (post.video_url.length !== 0) {
            return post.video_url;
        }
        if (utilsService.isValidHttpUrl(post.body)) {
            return post.body;
        }
        return post.body;
    };
    postContent =
        post.body.slice(0, contentMaxChars) + (post.body.length > contentMaxChars ? '...' : '');

    return (
        <Card sx={{ border: 'none', boxShadow: 'none' }}>
            <ThemeProvider theme={theme}>
                <CardContent sx={{ height: 80, overflow: 'hidden', px: 0 }}>
                    <Typography variant="h4" fontFamily={'Palatino, Times New Roman, Times, serif'}>
                        <Link
                            component={RouterLink}
                            to={`/posts/${post.reddit_id}`}
                            underline="none"
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    color: 'grey.600',
                                },
                            }}
                        >
                            {post.title}
                        </Link>
                    </Typography>
                    <Typography variant="body2" color="text.primary" fontSize={15}>
                        {postContent}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, px: 0, pt: 1 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={2}
                        minWidth="100%"
                    >
                        <Grid container direction="row" alignItems="center" maxWidth={'5rem'}>
                            <Grid item sx={{ ml: -0.5, mt: 0.2 }}>
                                <ForwardIcon
                                    color="primary"
                                    sx={{ transform: 'rotate(-90deg)', fontSize: 20 }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                    fontWeight="700"
                                    fontSize={15}
                                >
                                    {utilsService.formatNumber(post.upvotes)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" alignItems="center">
                            <Grid item sx={{ mb: -0.5, mr: 0.4 }}>
                                <CommentIcon color="action" sx={{ fontSize: 16 }} />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight="500"
                                    fontSize={15}
                                >
                                    {utilsService.formatNumber(post.num_comments)} comments
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardActions>
            </ThemeProvider>
        </Card>
    );
}

export default PostPreviewCard;
