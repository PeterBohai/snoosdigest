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
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Logout from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import configService from '../services/config';
import apiService from '../services/api';
import utilsService from '../services/utils';
import { userActions, updateUserSubscriptions } from '../store/userSlice';
import AddSubredditDialog from './AddSubredditDialog';


const drawerWidth = 280;

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

function DeleteSubredditAlert({ handleDelete, subreddit, setSubreddit, open, setOpen }) {
    
    const handleYes = () => {
        handleDelete(subreddit);
        setOpen(false);
        setSubreddit('');
    };
    
    const handleClose = () => {
        setOpen(false);
        setSubreddit('');
    };

    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {`Delete ${subreddit} Confirmation`}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{subreddit}" from your list?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>CANCEL</Button>
        <Button onClick={handleYes} autoFocus color='secondary'>
            YES
        </Button>
        </DialogActions>
    </Dialog>
}


function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userSubscriptions = useSelector(state => state.user.subscriptions);
    const userData = useSelector(state => state.user.userData);
    const [openSideDrawer, setOpenSideDrawer] = useState(false);
    const [openAddSubreddit, setOpenAddSubreddit] = useState(false);
    const [openDeleteSubredditAlert, setOpenDeleteSubredditAlert] = useState(false);
    const [selectedDeleteSubreddit, setSelectedDeleteSubreddit] = useState('');
    const [userProfileMenuToggle, setUserProfileMenuToggle] = useState(null);
    const [subheaderYourSubredditState, setSubheaderYourSubredditState] = useState({hover: false, edit: false});

    useEffect(() => {
        if (userData) {
            console.log('dispatch(updateUserSubscriptions());');
            dispatch(updateUserSubscriptions());
        }
    }, [userData, dispatch]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (!openSideDrawer) {
            setSubheaderYourSubredditState({...subheaderYourSubredditState, edit: false})
        }
        setOpenSideDrawer(!openSideDrawer);
    };

    const handleSubredditClick = (subreddit_name) => {
        navigate(`/subreddits/${utilsService.removeSubredditPrefix(subreddit_name)}`);
    };

    const handleOpenUserProfileMenu = (event) => {
        setUserProfileMenuToggle(event.currentTarget);
    };
    
    const handleCloseUserProfileMenu = () => {
        setUserProfileMenuToggle(null);
    }

    const handleAddSubredditClick = () => {
        setOpenAddSubreddit(true);
        setSubheaderYourSubredditState({...subheaderYourSubredditState, edit: false})
    }

    const handleLogOut = () => {
        handleCloseUserProfileMenu();
        localStorage.removeItem('access');
        dispatch(userActions.logout());
        console.log('dispatch(updateUserSubscriptions());');
        dispatch(updateUserSubscriptions());
    }

    const handleDeleteSubreddit = (subreddit_prefixed) => {
        apiService.deleteUserSubscriptions(subreddit_prefixed)
            .then(res => {
                console.log('dispatch(updateUserSubscriptions());');
                dispatch(updateUserSubscriptions());
            })
            .catch(err => {
                console.error(err.response);
            })
    }

    const handleDeleteSubredditClick = (subreddit) => {
        setOpenDeleteSubredditAlert(true);
        setSelectedDeleteSubreddit(subreddit);
    }

    const YOUR_SUBREDDIT_EDIT_BUTTON = () => {
        if (!userData) {
            return null;
        }
        if (subheaderYourSubredditState.edit) {
            return <Button 
                edge="end" 
                aria-label="edit-subscriptions" 
                onClick={() => setSubheaderYourSubredditState({...subheaderYourSubredditState, edit: false})}
            >
                <EditIcon sx={{ fontSize: 18, pr:0.5}}/>  <Typography>Done</Typography>
            </Button>
        } 
        
        if (subheaderYourSubredditState.hover && !subheaderYourSubredditState.edit) {
            return <IconButton 
                edge="end" 
                aria-label="edit-subscriptions" 
                onClick={() => setSubheaderYourSubredditState({...subheaderYourSubredditState, edit: true})}
            >
                <EditIcon sx={{ fontSize: 18}}/>
            </IconButton>
        }
        return null;
    }

    return (
        <Box sx={{mb: 7}}>
            <ThemeProvider theme={theme}>
            {/* The zIndex is used to clip the side menu (Drawer) underneath the AppBar */}
            <AppBar position='fixed' color='primary' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar variant='dense' sx={{mx: '10px'}}>
                    <IconButton onClick={toggleDrawer()} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
                        <MenuIcon />
                    </IconButton>
                    <Link component={RouterLink} to='/' underline='none' color='inherit' sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="div">
                            Snoos Digest
                        </Typography>
                    </Link>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        {location.pathname === '/login' || userData
                            ? null 
                            : <Button sx={{height: '30px'}} variant="outlined" color='info' component={RouterLink} to='/login'>Log In</Button>
                        }
                        {location.pathname === '/signup' || userData
                            ? null 
                            : <Button sx={{height: '30px'}} variant="contained" color='info' component={RouterLink} to='/signup'>Sign Up</Button>
                        }
                        {
                        // When user is logged in, show a profile avatar on the right side of the AppBar
                        !userData
                            ? null
                            : (
                                <Box>
                                    <IconButton onClick={handleOpenUserProfileMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ width: 30, height: 30 }} alt={userData['snoosdigest/username']}>{userData['snoosdigest/username'][0].toUpperCase()}</Avatar>
                                    </IconButton>
                                    <Menu
                                        sx={{ mt: '30px', ml: '3px' }}
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
                
                anchor="left"
                open={openSideDrawer}
                onClose={toggleDrawer()}
            >
                <Toolbar variant='dense'/>
                <Box
                    role="presentation"
                >
                    <List>
                        <ListItem
                            secondaryAction={
                                <YOUR_SUBREDDIT_EDIT_BUTTON />
                            }
                            sx={{pl: 0, pb:0, pt:0}}
                            onMouseEnter={() => setSubheaderYourSubredditState({...subheaderYourSubredditState, hover: true})}
                            onMouseLeave={() => setSubheaderYourSubredditState({...subheaderYourSubredditState, hover: false})}
                        >
                            <ListSubheader component='div' id='your-subreddits-subheader'>YOUR SUBREDDITS</ListSubheader>
                        </ListItem>
    
                    {userSubscriptions.map((subreddit_name, index) => (
                        <ListItem 
                            button={!subheaderYourSubredditState.edit} 
                            key={subreddit_name} 
                            sx={{maxWidth: '100%'}} 
                            onClick={subheaderYourSubredditState.edit ? null: () => handleSubredditClick(subreddit_name)}
                            secondaryAction={
                                subheaderYourSubredditState.edit 
                                ? <IconButton aria-label="delete" onClick={() => handleDeleteSubredditClick(subreddit_name)}>
                                    <DeleteIcon sx={{fontSize: 20}}/>
                                </IconButton>
                                : null
                            }
                        >
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
                                onKeyDown={toggleDrawer()}
                                onClick={toggleDrawer()}
                            />
                        </ListItem>
                    ))}
                    </List>
                    
                    <Fab size='small' color='primary' aria-label='add subreddit' sx={{ position: 'absolute', bottom: 20, right: 20 }} onClick={handleAddSubredditClick}>
                        <AddIcon />
                    </Fab>
                    
                    <DeleteSubredditAlert 
                        handleDelete={handleDeleteSubreddit}
                        subreddit={selectedDeleteSubreddit}
                        setSubreddit={setSelectedDeleteSubreddit}
                        open={openDeleteSubredditAlert} 
                        setOpen={setOpenDeleteSubredditAlert} 
                    />
                    <AddSubredditDialog openAddSubreddit={openAddSubreddit} setOpenAddSubreddit={setOpenAddSubreddit}/>
                </Box>
            </Drawer>
            </ThemeProvider>
        </Box>
    );
}

export default Header;
