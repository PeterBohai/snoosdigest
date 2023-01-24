import React from "react";
import Markdown from "markdown-to-jsx";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ForwardIcon from "@mui/icons-material/Forward";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTheme } from "@mui/material/styles";

import utilsService from "../services/utils";
import themeService from "../services/theme";

function CommentCard({ comment }) {
    const commentBody = (comment) => {
        return <Markdown options={themeService.markdownBaseOptions}>{comment.body}</Markdown>;
    };
    const theme = useTheme();

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
                    <Grid item container direction="column" xs>
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
                        <Grid item sx={{ pt: 1.5 }}>
                            <Typography variant="body1" component="div">
                                {commentBody(comment)}
                            </Typography>
                        </Grid>
                        <Grid item container alignItems="center">
                            <Grid item sx={{ ml: -0.4, mt: 0.4 }}>
                                <ForwardIcon
                                    color="primary"
                                    sx={{ transform: "rotate(-90deg)", fontSize: 20 }}
                                />
                            </Grid>
                            <Grid item width={32}>
                                <Typography variant="body2" fontWeight="bold">
                                    {utilsService.formatNumber(comment.upvotes)}
                                </Typography>
                            </Grid>
                            <Button
                                href={comment.permalink}
                                target="_blank"
                                color="discrete"
                                startIcon={
                                    <LaunchIcon sx={{ mr: -0.5, transform: "scale(0.85)" }} />
                                }
                                sx={{ ml: 2, mt: -0.07, fontWeight: "bold" }}
                            >
                                Reddit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CommentCard;
