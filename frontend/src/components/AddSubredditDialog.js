import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";

import apiService from "../services/api";
import configService from "../services/config";
import { updateUserSubscriptions } from "../store/userSlice";
import AutoComplete from "./AutoComplete";

function AddSubredditDialog({ openAddSubreddit, setOpenAddSubreddit, setOpenSideDrawer }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [subredditNameInput, setSubredditNameInput] = useState("");
    const [inputErrorText, setInputErrorText] = useState("");
    const userData = useSelector((state) => state.user.userData);
    const userSubscriptions = useSelector((state) => state.user.subscriptions);

    const handleSubredditNameInputChange = (value) => {
        setSubredditNameInput(value);
        setInputErrorText("");
    };

    const handleClose = () => {
        setOpenAddSubreddit(false);
        setSubredditNameInput("");
        setInputErrorText("");
    };

    const handleLogin = () => {
        setOpenAddSubreddit(false);
        setOpenSideDrawer(false);
        navigate("/login");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        apiService
            .postUserSubscriptions(subredditNameInput)
            .then((res) => {
                console.info(res.data);
                console.info("dispatch(updateUserSubscriptions());");
                dispatch(updateUserSubscriptions());
                setOpenAddSubreddit(false);
                setSubredditNameInput("");
                setInputErrorText("");
            })
            .catch((err) => {
                console.info(`Endpoint responded with status code ${err.response.status}`);
                const errorResponse = err.response;
                const errorData =
                    errorResponse >= 500 ? "Internal server error" : errorResponse.data;
                setInputErrorText(errorData);
            });
    };

    if (userSubscriptions.length >= configService.MAX_SUBSCRIPTIONS_NUM_PER_USER) {
        return (
            <Dialog open={openAddSubreddit} onClose={handleClose}>
                <DialogTitle>Add a Subreddit</DialogTitle>
                <DialogContent>
                    <DialogContentText textAlign="left">
                        SnoosDigest users should not subscribe to more than{" "}
                        <strong>10 subreddits</strong>.
                        <br />
                        Adding more will make things hard to digest!
                        <br />
                        <br />
                        Try the <EditIcon sx={{ fontSize: 18, pr: 0.5 }} /> icon beside YOUR
                        SUBREDDITS to remove a subreddit.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button color="primary" onClick={handleClose}>
                        OKAY
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Box>
            {userData ? (
                <Dialog open={openAddSubreddit} onClose={handleClose}>
                    <DialogTitle>Add a Subreddit</DialogTitle>
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogContent sx={{ pt: 0 }}>
                            <DialogContentText>
                                To add a new subreddit to follow, please enter the subreddit's name
                                below.
                            </DialogContentText>
                            <AutoComplete
                                id="subreddit-name"
                                onChange={handleSubredditNameInputChange}
                                error={inputErrorText !== ""}
                                helperText={inputErrorText}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" type="submit">
                                ADD
                            </Button>
                            <Button color="primary" onClick={handleClose}>
                                CANCEL
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            ) : (
                <Dialog open={openAddSubreddit} onClose={handleClose}>
                    <DialogTitle>Add a Subreddit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Only users can add or customize subreddit subscriptions. Please login or
                            signup for an account.
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
            )}
        </Box>
    );
}

export default AddSubredditDialog;
