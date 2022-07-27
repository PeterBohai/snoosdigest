import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation} from 'react-router-dom';

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
import Logout from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import apiService from '../services/api';
import configService from '../services/config';
import utilsService from '../services/utils';
import { userActions } from '../store/userSlice';


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
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [watchlist, setWatchlist] = useState([]);
    const [userProfileMenuToggle, setUserProfileMenuToggle] = useState(null);
    const userData = useSelector(state => state.user.userData);

    useEffect(() => {
        apiService
            .getUserWatchlist()
            .then(res => {
                console.log(res.data);
                setWatchlist(res.data);
            });
    }, []);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    const toggleDrawer = () => {
        if (!open) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleSubredditClick = (subreddit_name) => {
        setOpen(false);
        navigate(`/subreddits/${utilsService.removeSubredditPrefix(subreddit_name)}`);
    };

    const handleOpenUserProfileMenu = (event) => {
        setUserProfileMenuToggle(event.currentTarget);
    };
    
    const handleCloseUserProfileMenu = () => {
        setUserProfileMenuToggle(null);
    }

    const handleLogOut = () => {
        handleCloseUserProfileMenu();
        localStorage.removeItem('access');
        dispatch(userActions.logout());
    }

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
                    <Stack direction="row" spacing={1}>
                        {location.pathname === '/login' || userData
                            ? null 
                            : <Button variant="outlined" color='info' component={RouterLink} to='/login'>Log In</Button>
                        }
                        {location.pathname === '/signup' || userData
                            ? null 
                            : <Button variant="contained" color='info' component={RouterLink} to='/signup'>Sign Up</Button>
                        }
                        {
                        // When user is logged in, show a profile avatar on the right side of the AppBar
                        !userData
                            ? null
                            : (
                                <Box>
                                    <IconButton onClick={handleOpenUserProfileMenu} sx={{ p: 0 }}>
                                        <Avatar alt={userData['snoosdigest/username']}>{userData['snoosdigest/username'][0].toUpperCase()}</Avatar>
                                    </IconButton>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id='menu-appbar'
                                        anchorEl={userProfileMenuToggle}
                                        keepMounted
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                        open={Boolean(userProfileMenuToggle)}
                                        onClose={handleCloseUserProfileMenu}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                              overflow: 'visible',
                                              filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.32))',
                                              mt: 1.5,
                                              '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                              },
                                              '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                              },
                                            },
                                          }}
                                    >
                                        <MenuItem key='logout' onClick={handleLogOut}>
                                            <ListItemIcon>
                                                <Logout fontSize='small' />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            )
                        }
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
                    {watchlist.map((subreddit_name, index) => (
                        <ListItem button key={subreddit_name} sx={{maxWidth: '100%'}} onClick={() => handleSubredditClick(subreddit_name)}>
                            <ListItemIcon sx={{minWidth: '36px'}}>
                                <ArrowCircleRightIcon color='primary' />
                            </ListItemIcon>
                            <ListItemText 
                                primary={subreddit_name}
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
