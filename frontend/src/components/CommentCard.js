import React, { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";
import { Link as RouterLink } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import ForwardIcon from "@mui/icons-material/Forward";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTheme } from "@mui/material/styles";

import utilsService from "../services/utils";
import themeService from "../services/theme";
import { getHackernewsCommentDetails } from "../services/hackernews";

function CommentCard({ commentDetail, commentID, appName, needFetch = false }) {
    const theme = useTheme();

    const [comment, setComment] = useState(commentDetail);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (!needFetch) {
            setComment(commentDetail);
        } else {
            getHackernewsCommentDetails(commentID)
                .then((res) => {
                    setComment(res.data);
                })
                .catch((err) => {
                    if (err.response) {
                        const error = err.response;
                        console.error(`${error.status} Response - ${JSON.stringify(error.data)}`);
                        setApiError(error.data);
                    } else if (err.request) {
                        console.error(`Request made but got no response. Request - ${err.request}`);
                        setApiError("Something is wrong, could not get response.");
                    } else {
                        console.error(`There was an issue with the request - ${err.message}`);
                        setApiError("Something is wrong with the request.");
                    }
                });
        }
    }, [needFetch, commentDetail, commentID]);
    if (!comment) return null;
    const commentBody = (comment, appName) => {
        if (appName === "hackernews") {
            return comment.body;
        }
        return <Markdown options={themeService.markdownBaseOptions}>{comment.body}</Markdown>;
    };
    if (apiError) return null;

    return (
        <Card
            variant="outlined"
            sx={{ borderColor: "transparent", backgroundColor: theme.palette.background.default }}
        >
            <CardContent sx={{ p: 0, pb: "0.5rem !important" }}>
                <Grid container direction="row" spacing={1}>
                    <Grid item>
                        <Avatar sx={{ width: 18, height: 18 }}></Avatar>
                    </Grid>
                    <Grid item container direction="column" xs wrap="nowrap">
                        <Grid item container spacing={0.5}>
                            <Grid item>
                                <Typography variant="body2" color="text" fontWeight="bold">
                                    {comment.author}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="discrete.main">
                                    ·
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="discrete.main">
                                    {utilsService.getRelativeTime(comment.created_utc)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ pt: 1.5 }} zeroMinWidth>
                            <Typography
                                variant="body1"
                                component="div"
                                sx={{ overflowWrap: "break-word" }}
                            >
                                {commentBody(comment, appName)}
                            </Typography>
                        </Grid>
                        <Grid item container alignItems="center">
                            {!comment.upvotes ? null : (
                                <>
                                    <Grid item sx={{ ml: -0.4, mt: 0.4 }}>
                                        <ForwardIcon
                                            sx={{
                                                transform: "rotate(-90deg)",
                                                fontSize: 20,
                                                color: theme.palette.app[appName],
                                            }}
                                        />
                                    </Grid>
                                    <Grid item width={32} sx={{ mr: 2 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {utilsService.formatNumber(comment.upvotes)}
                                        </Typography>
                                    </Grid>
                                </>
                            )}

                            <Link
                                component={RouterLink}
                                to={comment.permalink}
                                underline="hover"
                                target="_blank"
                                color="discrete"
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        ml: "-5px",
                                        display: "flex",
                                        alignItems: "center",
                                        color: "discrete.main",
                                        fontWeight: "bold",
                                        py: "5px",
                                    }}
                                >
                                    <LaunchIcon sx={{ transform: "scale(0.75)" }} />
                                    Source
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CommentCard;
