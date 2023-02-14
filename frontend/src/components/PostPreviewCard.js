import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import ForwardIcon from "@mui/icons-material/Forward";
import Button from "@mui/material/Button";
import Comment from "@mui/icons-material/Comment";
import Skeleton from "@mui/material/Skeleton";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTheme } from "@mui/material/styles";

import utilsService from "../services/utils";
import { getHackernewsPostDetails } from "../services/hackernews";

const CONTENT_MAX_CHARS = 320;
const getPostContent = (post) => {
    if (Object.keys(post).length === 0 || !post.body) return "";
    if (post.body_is_url) {
        return (
            <Link
                component={RouterLink}
                to={post.body}
                target="_blank"
                sx={{ color: "primary.main" }}
                underline="hover"
            >
                {post.body}
            </Link>
        );
    }
    return (
        post.body.slice(0, CONTENT_MAX_CHARS) + (post.body.length > CONTENT_MAX_CHARS ? "..." : "")
    );
};

function PostPreviewCard({ postDetail, postID, needFetch = false }) {
    const theme = useTheme();
    const [post, setPost] = useState({});
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (!needFetch) {
            setPost(postDetail);
        } else {
            getHackernewsPostDetails(postID)
                .then((res) => {
                    setPost(res.data);
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
    }, [postDetail, postID, needFetch]);
    if (!post) return null;

    const appName = post.snoosdigest_app;
    const postid = post[`${appName}_id`];
    const detailPagePath = `/${appName}/posts/${postid}`;
    if (apiError) return null;
    if (!post || Object.keys(post).length === 0) {
        return <Skeleton variant="rounded" height={130} sx={{ mt: 4 }} />;
    }
    return (
        <Card
            sx={{
                border: "none",
                boxShadow: "none",
                backgroundColor: theme.palette.background.default,
            }}
        >
            <CardContent sx={{ overflow: "hidden", px: 0, pb: 0, pt: 1 }}>
                <Typography
                    variant="h4"
                    fontFamily={"Domine, Palatino, Times New Roman, Times, serif"}
                >
                    <Link
                        component={RouterLink}
                        to={detailPagePath}
                        underline="none"
                        color="inherit"
                        sx={{
                            "&:hover": {
                                color: "grey.600",
                            },
                        }}
                    >
                        {post.title}
                    </Link>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.4} mt={0}>
                    <AccessTimeIcon sx={{ color: "discrete.main", fontSize: 16, mt: -0.2 }} />
                    <Typography variant="body2" color="discrete.main">
                        {`${utilsService.getRelativeTime(post.created_utc)} 
                            by ${appName === "reddit" ? "/u" : ""}${post.author_name}`}
                    </Typography>
                </Stack>
                <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                    sx={{
                        mt: 1,
                        overflowWrap: "break-word",
                    }}
                >
                    {getPostContent(post)}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, px: 0, pt: 0.5 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={2}
                    minWidth="100%"
                >
                    <Stack direction="row" alignItems="center" spacing={0.3} minWidth="3.8rem">
                        <ForwardIcon
                            sx={{
                                transform: "rotate(-90deg)",
                                fontSize: 20,
                                ml: -0.5,
                                mt: -0.3,
                                color: theme.palette.app[appName],
                            }}
                        />
                        <Typography variant="body1" color="text.primary" fontWeight="700">
                            {utilsService.formatNumber(post.upvotes)}
                        </Typography>
                    </Stack>
                    <Button
                        component={RouterLink}
                        to={detailPagePath}
                        startIcon={<Comment sx={{ transform: "scale(0.95)", mr: -0.55 }} />}
                        sx={{ color: "discrete.main", transition: "none" }}
                        size="small"
                    >
                        <Typography variant="body1" fontWeight="500">
                            {utilsService.formatNumber(post.num_comments)} Comments
                        </Typography>
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
}

export default PostPreviewCard;
