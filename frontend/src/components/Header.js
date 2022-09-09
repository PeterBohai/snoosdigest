import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "@mui/material/Link";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Logout from "@mui/icons-material/Logout";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import apiService from "../services/api";
import utilsService from "../services/utils";
import { userActions, updateUserSubscriptions } from "../store/userSlice";
import { themeActions } from "../store/themeSlice";
import AddSubredditDialog from "./AddSubredditDialog";
import ScrollToUpdate from "./ScrollToUpdate";

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    })
);

function DeleteSubredditAlert({
    handleDelete,
    subreddit,
    setSubreddit,
    open,
    setOpen,
    userData,
    setOpenSideDrawer,
}) {
    const navigate = useNavigate();

    const handleYes = () => {
        handleDelete(subreddit);
        setOpen(false);
        setSubreddit("");
    };

    const handleClose = () => {
        setOpen(false);
        setSubreddit("");
    };

    const handleLogin = () => {
        setOpen(false);
        setOpenSideDrawer(false);
        navigate("/login");
    };

    if (!userData) {
        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{`Delete ${subreddit}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Only users can delete or add subreddit subscriptions. Please login or signup
                        for an account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleLogin}>
                        LOGIN
                    </Button>
                    <Button color="primary" onClick={handleClose}>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{`Delete ${subreddit} Confirmation`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete "{subreddit}" from your list?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleYes} autoFocus color="secondary">
                    YES
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useTheme();
    const userSubscriptions = useSelector((state) => state.user.subscriptions);
    const userData = useSelector((state) => state.user.userData);
    const darkMode = useSelector((state) => state.theme.darkMode);
    const [openSideDrawer, setOpenSideDrawer] = useState(false);
    const [openAddSubreddit, setOpenAddSubreddit] = useState(false);
    const [openDeleteSubredditAlert, setOpenDeleteSubredditAlert] = useState(false);
    const [selectedDeleteSubreddit, setSelectedDeleteSubreddit] = useState("");
    const [userProfileMenuToggle, setUserProfileMenuToggle] = useState(null);
    const [subheaderYourSubredditState, setSubheaderYourSubredditState] = useState({
        hover: false,
        edit: false,
    });

    useEffect(() => {
        const updateSubscriptions = async () => {
            try {
                await dispatch(updateUserSubscriptions()).unwrap();
            } catch (err) {
                if (err.code === "user_not_found") {
                    // User was deleted at some point but still logged in. Log them out.
                    navigate("/", { replace: true });
                    localStorage.removeItem("user");
                    dispatch(userActions.logout());
                    window.location.reload();
                }
            }
        };

        if (userData) {
            console.log("dispatch(updateUserSubscriptions());");
            updateSubscriptions();
        }
    }, [userData, dispatch]);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (!openSideDrawer) {
            setSubheaderYourSubredditState({ hover: false, edit: false });
        }
    }, [openSideDrawer]);

    const toggleDrawer = () => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setOpenSideDrawer(!openSideDrawer);
    };

    const handleSubredditClick = (subreddit_name) => {
        setOpenSideDrawer(false);
        navigate(`/subreddits/${utilsService.removeSubredditPrefix(subreddit_name)}`);
    };

    const handleOpenUserProfileMenu = (event) => {
        setOpenSideDrawer(false);
        setUserProfileMenuToggle(event.currentTarget);
    };

    const handleCloseUserProfileMenu = () => {
        setOpenSideDrawer(false);
        setUserProfileMenuToggle(null);
    };

    const handleAddSubredditClick = () => {
        setOpenAddSubreddit(true);
        setSubheaderYourSubredditState({ ...subheaderYourSubredditState, edit: false });
    };

    const handleLogOut = async () => {
        handleCloseUserProfileMenu();
        navigate("/", { replace: true });
        localStorage.removeItem("user");
        dispatch(userActions.logout());
        window.location.reload();
    };

    const handleDeleteSubreddit = (subreddit_prefixed) => {
        apiService
            .deleteUserSubscriptions(subreddit_prefixed)
            .then((res) => {
                console.log("dispatch(updateUserSubscriptions());");
                dispatch(updateUserSubscriptions());
            })
            .catch((err) => {
                console.error(err.response);
            });
    };

    const handleDeleteSubredditClick = (subreddit) => {
        setOpenDeleteSubredditAlert(true);
        setSelectedDeleteSubreddit(subreddit);
    };

    const YOUR_SUBREDDIT_EDIT_BUTTON = () => {
        if (subheaderYourSubredditState.edit) {
            return (
                <Button
                    edge="end"
                    aria-label="edit-subscriptions"
                    onClick={() =>
                        setSubheaderYourSubredditState({
                            ...subheaderYourSubredditState,
                            edit: false,
                        })
                    }
                >
                    <EditIcon sx={{ fontSize: 18, pr: 0.5 }} /> <Typography>Done</Typography>
                </Button>
            );
        }
        return (
            <IconButton
                edge="end"
                aria-label="edit-subscriptions"
                onClick={() =>
                    setSubheaderYourSubredditState({
                        ...subheaderYourSubredditState,
                        edit: true,
                    })
                }
            >
                <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
        );
    };

    return (
        <Box sx={{ mb: 7 }}>
            {/* The zIndex is used to clip the side menu (Drawer) underneath the AppBar */}
            <ScrollToUpdate openSideDrawer={openSideDrawer}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{ mx: "10px" }}>
                        <IconButton
                            onClick={toggleDrawer()}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box component="div" color="inherit" sx={{ flexGrow: 1 }}>
                            <Link
                                component={RouterLink}
                                to="/"
                                underline="none"
                                color="inherit"
                                onClick={() => setOpenSideDrawer(false)}
                            >
                                <Typography
                                    variant="h5"
                                    component="span"
                                    sx={{
                                        letterSpacing: ".1rem",
                                        color: "inherit",
                                    }}
                                >
                                    SnoosDigest
                                </Typography>
                            </Link>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <IconButton
                                sx={{ ml: 1 }}
                                onClick={() => {
                                    dispatch(themeActions.toggleDarkMode());
                                }}
                                color="inherit"
                            >
                                {theme.palette.mode === "dark" ? (
                                    <Brightness7Icon />
                                ) : (
                                    <Brightness4Icon />
                                )}
                            </IconButton>
                            {location.pathname === "/login" || userData ? null : (
                                <Button
                                    sx={{ height: "30px" }}
                                    variant="outlined"
                                    color="primary"
                                    component={RouterLink}
                                    to="/login"
                                    onClick={() => setOpenSideDrawer(false)}
                                >
                                    Log In
                                </Button>
                            )}
                            {location.pathname === "/signup" || userData ? null : (
                                <Button
                                    sx={{ height: "30px" }}
                                    variant="contained"
                                    color="primary"
                                    component={RouterLink}
                                    to="/signup"
                                    onClick={() => setOpenSideDrawer(false)}
                                >
                                    Sign Up
                                </Button>
                            )}
                            {
                                // When user is logged in, show a profile avatar on the right side of the AppBar
                                !userData ? null : (
                                    <Box>
                                        <IconButton
                                            onClick={handleOpenUserProfileMenu}
                                            sx={{ p: 0 }}
                                        >
                                            <Avatar
                                                sx={{
                                                    margin: "5px",
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: "primary.main",
                                                }}
                                                alt={userData["snoosdigest/username"]}
                                            >
                                                {utilsService.getUserLetteredAvatar(userData)}
                                            </Avatar>
                                        </IconButton>
                                        <Menu
                                            sx={{ mt: "36px", ml: "-3px" }}
                                            id="menu-appbar"
                                            anchorEl={userProfileMenuToggle}
                                            keepMounted
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            open={Boolean(userProfileMenuToggle)}
                                            onClose={handleCloseUserProfileMenu}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: "visible",
                                                    filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.32))",
                                                    bgcolor: "background.lighter",
                                                    mt: 1.5,
                                                    minWidth: 200,
                                                    "& .MuiAvatar-root": {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                    "&:before": {
                                                        content: '""',
                                                        display: "block",
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: "background.lighter",
                                                        transform: "translateY(-50%) rotate(45deg)",
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuList
                                                dense
                                                sx={{
                                                    py: 0,
                                                    "& .MuiListItemIcon-root": {
                                                        minWidth: "30px !important",
                                                        color: "text.primary",
                                                    },
                                                }}
                                            >
                                                <ListItem key="welcome" sx={{ fontSize: "14px" }}>
                                                    <ListItemIcon>
                                                        <PersonIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">
                                                        <strong>Welcome</strong>
                                                        <br />
                                                        {utilsService.getUserWelcomeName(userData)}
                                                    </Typography>
                                                </ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                <MenuItem key="logout" onClick={handleLogOut}>
                                                    <ListItemIcon>
                                                        <Logout fontSize="small" />
                                                    </ListItemIcon>
                                                    Logout
                                                </MenuItem>
                                                <MenuItem
                                                    key="settings"
                                                    component={RouterLink}
                                                    to="/settings/profile"
                                                    onClick={handleCloseUserProfileMenu}
                                                >
                                                    <ListItemIcon>
                                                        <SettingsIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    Profile settings
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                )
                            }
                        </Stack>
                    </Toolbar>
                </AppBar>
            </ScrollToUpdate>

            <Drawer
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgb(0, 0, 0, 0.1)",
                    },
                }}
                PaperProps={{
                    sx: {
                        width: drawerWidth,
                        bgcolor: "background.light",
                    },
                }}
                anchor="left"
                open={openSideDrawer}
                onClose={toggleDrawer()}
            >
                <Toolbar />
                <Box role="presentation">
                    <List>
                        <ListItem
                            secondaryAction={<YOUR_SUBREDDIT_EDIT_BUTTON />}
                            sx={{ pl: 0, pb: 0, pt: 0 }}
                            onMouseEnter={() =>
                                setSubheaderYourSubredditState({
                                    ...subheaderYourSubredditState,
                                    hover: true,
                                })
                            }
                            onMouseLeave={() =>
                                setSubheaderYourSubredditState({
                                    ...subheaderYourSubredditState,
                                    hover: false,
                                })
                            }
                        >
                            <ListSubheader
                                component="div"
                                id="your-subreddits-subheader"
                                sx={{ bgcolor: "background.light" }}
                            >
                                YOUR SUBREDDITS
                            </ListSubheader>
                        </ListItem>

                        {userSubscriptions.map((subreddit_name, index) => (
                            <ListItem
                                button={!subheaderYourSubredditState.edit}
                                key={subreddit_name}
                                sx={{ maxWidth: "100%" }}
                                onClick={
                                    subheaderYourSubredditState.edit
                                        ? null
                                        : () => handleSubredditClick(subreddit_name)
                                }
                                secondaryAction={
                                    subheaderYourSubredditState.edit ? (
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() =>
                                                handleDeleteSubredditClick(subreddit_name)
                                            }
                                        >
                                            <DeleteIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    ) : null
                                }
                            >
                                <ListItemIcon sx={{ minWidth: "36px" }}>
                                    <ArrowCircleRightIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={subreddit_name}
                                    primaryTypographyProps={{
                                        style: {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                    onKeyDown={toggleDrawer()}
                                    onClick={toggleDrawer()}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Fab
                        size="small"
                        color="primary"
                        aria-label="add subreddit"
                        sx={{ position: "absolute", bottom: 20, right: 20 }}
                        onClick={handleAddSubredditClick}
                    >
                        <AddIcon />
                    </Fab>

                    <DeleteSubredditAlert
                        handleDelete={handleDeleteSubreddit}
                        subreddit={selectedDeleteSubreddit}
                        setSubreddit={setSelectedDeleteSubreddit}
                        open={openDeleteSubredditAlert}
                        setOpen={setOpenDeleteSubredditAlert}
                        userData={userData}
                        setOpenSideDrawer={setOpenSideDrawer}
                    />
                    <AddSubredditDialog
                        openAddSubreddit={openAddSubreddit}
                        setOpenAddSubreddit={setOpenAddSubreddit}
                        setOpenSideDrawer={setOpenSideDrawer}
                    />
                </Box>
            </Drawer>
        </Box>
    );
}

export default Header;
