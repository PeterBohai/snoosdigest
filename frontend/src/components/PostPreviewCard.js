import React, { useEffect, useState, useRef } from "react";
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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTheme } from "@mui/material/styles";
import { convert } from "html-to-text";
import { marked } from "marked";

import utilsService from "../services/utils";
import { getHackernewsPostDetails } from "../services/hackernews";

const CONTENT_MAX_CHARS = 800;
const getPostContent = (post) => {
    if (Object.keys(post).length === 0 || !post.body) return "";
    if (post.snoosdigest_app === "hackernews" && post.body_url !== "") {
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
    let postText = post.body;
    if (post.snoosdigest_app === "reddit") {
        postText = marked.parse(postText);
    }
    postText = convert(postText, {
        selectors: [{ selector: "a", options: { hideLinkHrefIfSameAsText: true } }],
    });
    return postText.slice(0, CONTENT_MAX_CHARS);
};

function PostPreviewCard({ postDetail, postID, needFetch = false }) {
    const theme = useTheme();
    const bodyRef = useRef(null);
    const [post, setPost] = useState(postDetail);
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

    const appName = post.snoosdigest_app;
    const postid = post[`${appName}_id`];
    const detailPagePath = `/${appName}/posts/${postid}`;
    if (apiError) return null;
    const postBodyText = getPostContent(post);

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
                    variant="preview_title"
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
                    <AccessTimeIcon
                        sx={{
                            color: "discrete.main",
                            fontSize: { xs: 14, sm: 15 },
                        }}
                    />
                    <Typography
                        variant="body2"
                        color="discrete.main"
                        noWrap
                        fontSize={{
                            xs: "0.85rem",
                            sm: theme.typography.body2.fontSize,
                        }}
                    >
                        {`${utilsService.getRelativeTime(post.created_utc)} 
                            by ${appName === "reddit" ? "u/" : ""}${post.author_name}`}
                    </Typography>
                </Stack>
                <Typography
                    variant="preview_body"
                    color="text.primary"
                    component="div"
                    ref={bodyRef}
                    sx={{
                        mt: { xs: 0.5, md: 1 },
                        overflowWrap: "break-word",
                        ...(typeof postBodyText === "string" && {
                            [theme.breakpoints.between("xs", "mobile")]: {
                                maxHeight: "51px",
                                ...(postBodyText.length > 194 && {
                                    WebkitMaskImage:
                                        "linear-gradient(180deg, #000 60%, transparent)",
                                }),
                            },
                            [theme.breakpoints.between("mobile", "sm")]: {
                                maxHeight: "51px",
                                ...(postBodyText.length > 215 && {
                                    WebkitMaskImage:
                                        "linear-gradient(180deg, #000 60%, transparent)",
                                }),
                            },
                            [theme.breakpoints.between("sm", "md")]: {
                                maxHeight: "60px",
                                ...(postBodyText.length > 240 && {
                                    WebkitMaskImage:
                                        "linear-gradient(180deg, #000 60%, transparent)",
                                }),
                            },
                            [theme.breakpoints.between("md", "lg")]: {
                                maxHeight: "66px",
                                ...(postBodyText.length > 285 && {
                                    WebkitMaskImage:
                                        "linear-gradient(180deg, #000 60%, transparent)",
                                }),
                            },
                            [theme.breakpoints.up("lg")]: {
                                maxHeight: "71px",
                                ...(postBodyText.length > 340 && {
                                    WebkitMaskImage:
                                        "linear-gradient(180deg, #000 60%, transparent)",
                                }),
                            },
                        }),
                    }}
                >
                    {postBodyText}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, px: 0, pt: 0, pb: 1 }}>
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
