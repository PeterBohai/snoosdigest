import React from 'react';
import Markdown from 'markdown-to-jsx';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ForwardIcon from '@mui/icons-material/Forward';

import utilsService from '../services/utils';
import configService from '../services/config';

function CommentCard({ comment }) {
    const commentBody = (comment) => {
        return <Markdown options={configService.markdownBaseOptions}>{comment.body}</Markdown>;
    };

    return (
        <Card variant="outlined" sx={{ borderColor: 'transparent' }}>
            <CardContent sx={{ p: 0, pb: '0.5rem !important' }}>
                <Box sx={{}}>
                    <Typography variant="body2" component="div" color="text" fontWeight="bold">
                        {comment.author}
                        <Typography
                            variant="body2"
                            color="discrete.main"
                            sx={{ ml: 0.5 }}
                            display="inline"
                        >
                            {' · ' + utilsService.getRelativeTime(comment.created_utc)}
                        </Typography>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                        {commentBody(comment)}
                    </Typography>
                </Box>

                <Grid container direction="row" alignItems="center">
                    <Grid item sx={{ ml: -0.4, mt: 0.1 }}>
                        <ForwardIcon
                            color="action"
                            sx={{ transform: 'rotate(-90deg)', fontSize: 19 }}
                        />
                    </Grid>
                    <Grid item width={32}>
                        <Typography variant="body2" fontWeight="bold">
                            {comment.upvotes}
                        </Typography>
                    </Grid>
                    <Button
                        href={comment.permalink}
                        target="_blank"
                        color="discrete"
                        sx={{ ml: 2, mt: -0.07, fontWeight: 'bold' }}
                    >
                        Reddit
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CommentCard;
