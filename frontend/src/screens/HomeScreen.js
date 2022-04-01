import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider } from '@mui/material';


function HomeScreen() {
    return (
        <div>
            <Container>
                <Typography gutterBottom variant='h3' component='h3' sx={{mt: 2}}>Popular</Typography>
                <Divider />
                <Box sx={{pt: 3}}>
                    <Typography gutterBottom variant='h4' component='h4' sx={{fontWeight: 'bold'}}>
                        r/Bogleheads
                    </Typography>
                    
                    <Card variant="outlined">
                    <CardActionArea>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Egestas sed sed risus pretium quam vulputate dignissim
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in ante metus dictum at. Semper risus in hendrerit gravida rutrum. Sodales neque sodales ut etiam sit amet nisl.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    </Card>
                </Box>
            </Container>
        </div>
    );
}

export default HomeScreen