import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import CommentCard from "../components/CommentCard";
import apiService from "../services/api";
import utilsService from "../services/utils";
import themeService from "../services/theme";

function PostDetailScreen() {
    const theme = useTheme();
    const [post, setPost] = useState({});
    const [postComments, setPostComments] = useState([]);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("mobile"));
    const id = useParams().id;

    useEffect(() => {
        apiService.getPost(id).then((res) => {
            const postData = res.data;
            console.info(postData);
            setPost(postData);
            setPostComments(postData.comments);
        });
    }, [id]);

    const postContent = (post) => {
        if (Object.keys(post).length === 0) {
            return "";
        }
        if (post.img_url.length !== 0) {
            return <img src={post.img_url} alt="" />;
        }
        if (post.video_url.length !== 0) {
            return <CardMedia component="video" image={post.video_url} controls />;
        }
        if (utilsService.isValidHttpUrl(post.body)) {
            return (
                <Link href={post.body} target="_blank">
                    {post.body}
                </Link>
            );
        }
        return <Markdown options={themeService.markdownBaseOptions}>{post.body}</Markdown>;
    };

    return (
        <Container
            sx={{
                [theme.breakpoints.down("md")]: {
                    maxWidth: "sm",
                },
                [theme.breakpoints.up("md")]: {
                    maxWidth: "md",
                },
            }}
        >
            <Box sx={{ pt: 0, mt: 3, mb: 8, px: 0, whiteSpace: "pre-line" }}>
                {/* POST SECTION */}
                {Object.keys(post).length === 0 ? (
                    <Box>
                        <Skeleton variant="text" width={"80%"} height={100} />
                        <Skeleton variant="rounded" height={200} sx={{ mt: 2 }} />
                        <Skeleton variant="text" width={"40%"} height={60} sx={{ mt: 3 }} />
                    </Box>
                ) : (
                    <Box>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            alignItems={{ xs: "", md: "center" }}
                            spacing={{ xs: 0, md: 1 }}
                        >
                            {post.subreddit_display_name_prefixed.length !== 0 ? (
                                <Typography
                                    variant={{ xs: "body2", md: "body1" }}
                                    fontWeight="bold"
                                >
                                    {post.subreddit_display_name_prefixed}
                                </Typography>
                            ) : null}
                            <Typography
                                variant={{ xs: "body2", md: "body1" }}
                                color="discrete.main"
                            >
                                {`Posted ${utilsService.getRelativeTime(post.created_utc)} by u/${
                                    post.author_name
                                }`}
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

                        <Typography variant="body1" component="p" sx={{ my: 3 }}>
                            {postContent(post)}
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
                                        color="primary"
                                        sx={{ transform: "rotate(-90deg)", fontSize: 20, mt: 0.5 }}
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
                                    <ChatBubbleOutline sx={{ fontSize: 18, fontWeight: 500 }} />
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" fontWeight="500">
                                        {utilsService.formatNumber(post.num_comments)}{" "}
                                        {isSmallScreen ? "" : "Comments"}
                                    </Typography>
                                </Grid>
                                <Button
                                    href={post.reddit_url}
                                    startIcon={<LaunchIcon sx={{ mr: -0.5 }} />}
                                    target="_blank"
                                    sx={{ ml: 2, color: "discrete.main" }}
                                    size="large"
                                >
                                    Reddit
                                </Button>
                            </Grid>
                        </Stack>
                    </Box>
                )}

                <Typography variant="h5" sx={{ mt: 5 }} fontWeight="bold">
                    Top Comments
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                {/* COMMENT SECTION */}
                <Box>
                    <Stack spacing={2}>
                        {(postComments.length === 0 ? [...Array(5)] : postComments).map(
                            (comment, index) =>
                                comment ? (
                                    <>
                                        <CommentCard comment={comment} key={index} />
                                        <Divider sx={{ p: 0, mt: "0 !important" }} />
                                    </>
                                ) : (
                                    <Skeleton variant="rounded" height={100} key={index} />
                                )
                        )}
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}

export default PostDetailScreen;
