import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import apiService from "../services/api";
import { updateUserSubscriptions } from "../store/userSlice";

function AddSubredditDialog({ openAddSubreddit, setOpenAddSubreddit, setOpenSideDrawer }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [subredditNameInput, setSubredditNameInput] = useState("");
    const [inputErrorText, setInputErrorText] = useState("");
    const userData = useSelector((state) => state.user.userData);

    const handleSubredditNameInputChange = (event) => {
        setSubredditNameInput(event.target.value);
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

    const handleSubmit = () => {
        apiService
            .postUserSubscriptions(subredditNameInput)
            .then((res) => {
                console.log(res.data);
                console.log("dispatch(updateUserSubscriptions());");
                dispatch(updateUserSubscriptions());
                setOpenAddSubreddit(false);
                setSubredditNameInput("");
                setInputErrorText("");
            })
            .catch((err) => {
                console.log(`Endpoint responded with status code ${err.response.status}`);
                const errorResponse = err.response;
                const errorData =
                    errorResponse >= 500 ? "Internal server error" : errorResponse.data;
                setInputErrorText(errorData);
            });
    };

    return (
        <div>
            {userData ? (
                <Dialog open={openAddSubreddit} onClose={handleClose}>
                    <DialogTitle>Add a Subreddit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add a new subreddit to follow, please enter the subreddit's name
                            below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="subreddit-name"
                            label="Subreddit Name"
                            fullWidth
                            variant="standard"
                            value={subredditNameInput}
                            onChange={handleSubredditNameInputChange}
                            error={inputErrorText !== ""}
                            helperText={inputErrorText}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleSubmit}>
                            ADD
                        </Button>
                        <Button color="primary" onClick={handleClose}>
                            CANCEL
                        </Button>
                    </DialogActions>
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
        </div>
    );
}

export default AddSubredditDialog;
