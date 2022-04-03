import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


function PostPreviewCard({post}) {
    const contentMaxChars = 320;
    const postBody = post.body.slice(0, contentMaxChars) + (post.body.length > contentMaxChars ? '...' : '');
    
    // If body is empty, the post is simply linking to the permalink
    const postContent =  postBody || post.permalink

    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {postContent}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PostPreviewCard;
