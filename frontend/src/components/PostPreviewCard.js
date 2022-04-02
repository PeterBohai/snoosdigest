import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


function PostPreviewCard({post}) {
    return (
        <Card variant="outlined">
            <CardActionArea>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {/* If body is empty, the post is simply linking to the permalink */}
                    {post.body || post.permalink}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PostPreviewCard;
