import React, { useState }from 'react';
import { Link as RouterLink} from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import configService from '../services/config';

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })(
    ({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));


function Header() {
    const [open, setOpen] = useState(false);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    const toggleDrawer = () => {
        if (!open) {
            setOpen(true);
        } else {
            setOpen(false);
        }
        
    };

    return (
        <Box sx={{mb: 12}}>
            <ThemeProvider theme={theme}>
            {/* The zIndex is used to clip the side menu (Drawer) underneath the AppBar */}
            <AppBar position='fixed' color='primary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton onClick={toggleDrawer} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>
                    <Link component={RouterLink} to='/' underline='none' color='inherit' sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="div">
                            Snoos Digest
                        </Typography>
                    </Link>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color='info'>Log In</Button>
                        <Button variant='contained' color='info'>Sign Up</Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <Toolbar />
                <Box>
                    <List>
                        <ListItem button key={'Add Subreddit'}>
                            <ListItemIcon sx={{minWidth: '36px'}}>
                                <AddCircleOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Add Subreddit'} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                    {['r/Bogleads', 'r/FIRE', 'r/fatFIRE', 'r/financialindependence3212321'].map((text, index) => (
                        <ListItem button key={text} sx={{maxWidth: '100%'}}>
                            <ListItemIcon sx={{minWidth: '36px'}}>
                                <ArrowCircleRightIcon color='primary' />
                            </ListItemIcon>
                            <ListItemText 
                                primary={text}
                                primaryTypographyProps={{ 
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }} 
                            />
                        </ListItem>
                    ))}
                    </List>
                </Box>
            </Drawer>
            </ThemeProvider>
        </Box>
    );
}

export default Header;
