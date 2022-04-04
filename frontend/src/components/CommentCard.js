import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import utilsService from '../services/utils';


function CommentCard({ comment, sidePadding }) {

    return (
        <Card variant='outlined' sx={{borderColor: 'transparent'}}>
            <CardContent sx={{p: 0}}>
                <Box sx={{pl: sidePadding}}>
                    <Typography variant='body1' component='div' fontWeight={500}>
                        {comment.author} 
                        <Typography variant='subtitle1' color='text.secondary' sx={{ml: 0.5}} display='inline'>
                            {' · ' + utilsService.getRelativeTime(comment.created_utc)}
                        </Typography>
                    </Typography>
                    <Typography variant='body1'>
                        {comment.body}
                    </Typography>
                </Box>

                <Grid container direction='row' alignItems='center' sx={{pl: sidePadding - 1.1}}>
                    <Grid item>
                        <ArrowDropUpIcon color='action' sx={{fontSize: 32}} />
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1' color='text.secondary'>
                            {comment.upvotes}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CommentCard;
