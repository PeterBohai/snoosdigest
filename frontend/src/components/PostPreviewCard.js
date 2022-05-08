import React from 'react';
import { Link as RouterLink} from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import utilsService from '../services/utils';


function PostPreviewCard({post}) {
    const contentMaxChars = 320;

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    let postContent = (post) => {
        if (Object.keys(post).length === 0) {
            return ''
        }
        if (post.img_url.length !== 0 ) {
            return <img src={post.img_url} alt='' />
        }
        if (post.video_url.length !== 0 ) {
            return post.video_url
        }
        if (utilsService.isValidHttpUrl(post.body)) {
            return post.body
        }
        return post.body
    }
    postContent = post.body.slice(0, contentMaxChars) + (post.body.length > contentMaxChars ? '...' : '');

    return (
        <Card variant="outlined" sx={{borderColor: 'grey.400'}} >
            <CardActionArea component={RouterLink} to={`/posts/${post.id}`}>
            <ThemeProvider theme={theme}>
                <CardContent sx={{height: 80, overflow: 'hidden'}}>
                    <Typography gutterBottom variant="h5" fontWeight='500'>
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" >
                        {postContent}
                    </Typography>
                </CardContent>
                <CardActions sx={{p: 2}}>
                    <Stack direction='row' alignItems="center" justifyContent='flex-start' spacing={2} minWidth='100%'>
                        <Grid container direction='row' alignItems='center' maxWidth={'5rem'}>
                            <Grid item sx={{mr: 0.5}}>
                                <ChangeHistoryIcon color='action' sx={{fontSize: 20}} />
                            </Grid>
                            <Grid item>
                                <Typography variant='body1' color='text.primary' fontWeight='700'>
                                    {post.upvotes}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction='row' alignItems='center'>
                            <Grid item sx={{mb: -0.5, mr: 0.5}}>
                                <ChatBubbleOutlineIcon color='action' sx={{fontSize: 20}} />
                            </Grid>
                            <Grid item>
                                <Typography variant='body1' color='text.secondary' fontWeight='500'>
                                    {post.num_comments} Comments
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </CardActions>
            </ThemeProvider>
            </CardActionArea>
        </Card>
    );
}

export default PostPreviewCard;
