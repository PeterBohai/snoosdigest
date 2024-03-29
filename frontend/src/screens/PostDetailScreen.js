import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import Markdown from "markdown-to-jsx";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import LaunchIcon from "@mui/icons-material/Launch";
import Skeleton from "@mui/material/Skeleton";
import ForwardIcon from "@mui/icons-material/Forward";
import Comment from "@mui/icons-material/Comment";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import parseHtml from "html-react-parser";

import CommentCard from "../components/CommentCard";
import apiService from "../services/api";
import utilsService from "../services/utils";
import themeService from "../services/theme";

const getPostContent = (post, appName, theme) => {
    if (Object.keys(post).length === 0) {
        return "";
    }
    if (post.img_url && post.img_url.length !== 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Link
                    component={RouterLink}
                    to={post.img_url}
                    target="_blank"
                    sx={{
                        maxWidth: "100%",
                        [theme.breakpoints.up("sm")]: {
                            maxWidth: "90%",
                        },
                    }}
                >
                    <Box
                        component="img"
                        src={post.img_url}
                        alt={`${appName} post main content`}
                        sx={{
                            maxWidth: "100%",
                            [theme.breakpoints.up("sm")]: {
                                maxHeight: "800px",
                            },
                        }}
                    />
                </Link>
            </Box>
        );
    }
    if (post.video_url && post.video_url.length !== 0) {
        return <CardMedia component="video" src={post.video_url} controls />;
    }
    if (post.body_url && post.body_url !== "") {
        return (
            <Link
                component={RouterLink}
                to={post.body_url}
                target="_blank"
                sx={{ color: "primary.main" }}
                underline="hover"
            >
                {utilsService.getShortUrl(post.body_url)}
            </Link>
        );
    }

    if (appName === "hackernews") {
        return parseHtml(post.body);
    }
    return <Markdown options={themeService.markdownBaseOptions}>{post.body}</Markdown>;
};

function PostDetailScreen() {
    const theme = useTheme();
    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("mobile"));
    const { id, app } = useParams();
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (["reddit", "hackernews"].includes(app)) {
            apiService
                .getPost(id, app)
                .then((res) => {
                    const postData = res.data;
                    setPost(postData);
                    setPostComments(postData.comments);
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
    }, [id, app]);

    if (!["reddit", "hackernews"].includes(app)) return;
    if (apiError) return;

    return (
        <Container
            sx={{
                [theme.breakpoints.up("xs")]: {
                    maxWidth: "sm",
                },
                [theme.breakpoints.up("md")]: {
                    maxWidth: "750px",
                },
                [theme.breakpoints.up("lg")]: {
                    maxWidth: "md",
                },
            }}
        >
            <Box sx={{ pt: 0, mt: { xs: 1, sm: 2 }, mb: 8, px: 0, whiteSpace: "pre-line" }}>
                {/* POST SECTION */}
                {Object.keys(post).length === 0 ? (
                    <Box>
                        <Skeleton
                            variant="text"
                            width={"30%"}
                            sx={{ fontSize: theme.typography.body1 }}
                        />
                        <Skeleton
                            variant="text"
                            width={"80%"}
                            sx={{ fontSize: theme.typography.h2 }}
                        />
                        <Skeleton variant="rounded" height={200} sx={{ mt: 2 }} />
                        <Skeleton variant="rounded" width={"50%"} height={50} sx={{ mt: 3 }} />
                    </Box>
                ) : (
                    <Box>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "", sm: "center" }}
                            spacing={{ xs: -0.5, sm: 1 }}
                        >
                            {post.subreddit_name && post.subreddit_name.length !== 0 ? (
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    fontSize={{
                                        xs: theme.typography.body2.fontSize,
                                        mobile: theme.typography.body1.fontSize,
                                    }}
                                >
                                    <Link
                                        component={RouterLink}
                                        to={`/reddit/subreddits/${utilsService.removeSubredditPrefix(
                                            post.subreddit_name
                                        )}`}
                                        underline="hover"
                                        color="inherit"
                                    >
                                        {post.subreddit_name}
                                    </Link>
                                </Typography>
                            ) : (
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    fontSize={{
                                        xs: theme.typography.body2.fontSize,
                                        mobile: theme.typography.body1.fontSize,
                                    }}
                                >
                                    <Link
                                        component={RouterLink}
                                        to={`/${app}`}
                                        underline="hover"
                                        color="inherit"
                                    >
                                        {app}
                                    </Link>
                                </Typography>
                            )}
                            <Typography
                                variant="body1"
                                color="discrete.main"
                                fontSize={{
                                    xs: theme.typography.body2.fontSize,
                                    mobile: theme.typography.body1.fontSize,
                                }}
                            >
                                {`${utilsService.getRelativeTime(post.created_utc)} by ${
                                    app === "reddit" ? "u/" : ""
                                }${post.author_name}`}
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h2"
                            component="h1"
                            mt={1}
                            fontFamily={"Domine, Palatino, Times New Roman, Times, serif"}
                        >
                            {post.title}
                        </Typography>

                        <Typography
                            variant="body1"
                            component="div"
                            sx={{ my: 3, overflowWrap: "break-word" }}
                        >
                            {getPostContent(post, app, theme)}
                        </Typography>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-start"
                            spacing={2}
                        >
                            <Grid container direction="row" alignItems="center" maxWidth={"3.8rem"}>
                                <Grid item sx={{ ml: -0.4 }}>
                                    <ForwardIcon
                                        sx={{
                                            transform: "rotate(-90deg)",
                                            fontSize: 20,
                                            mt: 0.5,
                                            color: theme.palette.app[app],
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" fontWeight="bold">
                                        {utilsService.formatNumber(post.upvotes)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container direction="row" alignItems="center">
                                <Grid item sx={{ mb: -0.8, mr: 0.5 }}>
                                    <Comment
                                        sx={{
                                            fontSize: 18,
                                            fontWeight: 500,
                                            color: "discrete.main",
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="discrete.main"
                                    >
                                        {utilsService.formatNumber(post.num_comments)}{" "}
                                        {isSmallScreen ? "" : "Comments"}
                                    </Typography>
                                </Grid>
                                <Grid item sx={{ ml: 1 }}>
                                    <Button
                                        href={post[app + "_url"]}
                                        startIcon={
                                            <LaunchIcon
                                                sx={{ mr: -0.5, transform: "scale(0.9)" }}
                                            />
                                        }
                                        target="_blank"
                                        sx={{ color: "discrete.main", fontWeight: "bold" }}
                                        size="large"
                                    >
                                        Source
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Box>
                )}

                <Typography variant="h6" sx={{ mt: 5 }} fontWeight="bold">
                    Top Comments
                </Typography>
                <Divider sx={{ mb: 2.5, backgroundColor: "text.primary" }} />

                {/* COMMENT SECTION */}
                <Box>
                    <Stack spacing={2}>
                        {(postComments.length === 0 ? [...Array(5)] : postComments).map(
                            (comment, index) =>
                                comment ? (
                                    <Box key={index}>
                                        <CommentCard
                                            commentDetail={
                                                typeof comment === "object" ? comment : null
                                            }
                                            commentID={comment}
                                            needFetch={app === "hackernews"}
                                            appName={app}
                                        />
                                    </Box>
                                ) : (
                                    <Box key={index}>
                                        <Skeleton variant="text" width={"30%"} sx={{ mb: 1 }} />
                                        <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
                                    </Box>
                                )
                        )}
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}

export default PostDetailScreen;
