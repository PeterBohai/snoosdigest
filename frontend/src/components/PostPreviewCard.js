import React from "react";
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

import utilsService from "../services/utils";

function PostPreviewCard({ post }) {
    const contentMaxChars = 320;
    const theme = useTheme();

    let postContent = (post) => {
        if (Object.keys(post).length === 0) {
            return "";
        }
        if (post.img_url.length !== 0) {
            return <img src={post.img_url} alt="" />;
        }
        if (post.video_url.length !== 0) {
            return post.video_url;
        }
        if (utilsService.isValidHttpUrl(post.body)) {
            return post.body;
        }
        return post.body;
    };
    postContent =
        post.body.slice(0, contentMaxChars) + (post.body.length > contentMaxChars ? "..." : "");

    return (
        <Card
            sx={{
                border: "none",
                boxShadow: "none",
                backgroundColor: theme.palette.background.default,
            }}
        >
            <CardContent sx={{ overflow: "hidden", px: 0, pb: 1 }}>
                <Typography
                    variant="h4"
                    fontFamily={"Domine, Palatino, Times New Roman, Times, serif"}
                >
                    <Link
                        component={RouterLink}
                        to={`/reddit/posts/${post.reddit_id}`}
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
                <Stack direction="row" alignItems="center" spacing={0.4} mt={0.3}>
                    <AccessTimeIcon sx={{ color: "discrete.main", fontSize: 16, mt: -0.2 }} />
                    <Typography variant="body2" color="discrete.main">
                        {`${utilsService.getRelativeTime(post.created_unix_timestamp)} 
                            by u/${post.author_name}`}
                    </Typography>
                </Stack>
                <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{
                        mt: 1.7,
                    }}
                >
                    {postContent}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, px: 0, pt: 0 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    spacing={2}
                    minWidth="100%"
                >
                    <Stack direction="row" alignItems="center" spacing={0.3} minWidth="3.8rem">
                        <ForwardIcon
                            color="primary"
                            sx={{ transform: "rotate(-90deg)", fontSize: 20, ml: -0.5, mt: -0.3 }}
                        />
                        <Typography variant="body1" color="text.primary" fontWeight="700">
                            {utilsService.formatNumber(post.upvotes)}
                        </Typography>
                    </Stack>
                    <Button
                        component={RouterLink}
                        to={`/reddit/posts/${post.reddit_id}`}
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
