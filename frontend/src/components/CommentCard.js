import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
function CommentCard({ comment, sidePadding }) {

    return (
        <Card variant='outlined' sx={{borderColor: 'transparent'}}>
            <CardContent sx={{p: 0}}>
                <Box sx={{pl: sidePadding}}>
                    <Typography variant="h6" component="div">
                        {comment.author}
                    </Typography>
                    <Typography variant="body1">
                        {comment.body}
                    </Typography>
                </Box>

                <Grid container direction="row" alignItems="center" spacing={0.5} sx={{pl: sidePadding - 0.5}}>
                    <Grid item>
                        <ChangeHistoryIcon color='disabled'/>
                    </Grid>
                    <Grid item>
                        <Typography sx={{fontWeight: 'bold'}}>
                            {comment.score}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CommentCard;
