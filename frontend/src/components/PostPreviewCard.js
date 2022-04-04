import React from 'react';
import { Link as RouterLink} from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


function PostPreviewCard({post}) {
    const contentMaxChars = 320;
    const postBody = post.body.slice(0, contentMaxChars) + (post.body.length > contentMaxChars ? '...' : '');

    return (
        <Card variant="outlined" sx={{borderColor: 'grey.500'}}>
            <CardActionArea component={RouterLink} to={`/posts/${post.id}`}>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {postBody}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PostPreviewCard;
