import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import MenuIcon from "@mui/icons-material/Menu";

import PostPreviewCard from "../PostPreviewCard";
import apiService from "../../services/api";
import utilsService from "../../services/utils";
import { userActions } from "../../store/userSlice";

function RedditHome() {
    const [subredditPosts, setSubredditPosts] = useState({});
    const [displayNoSubredditAlert, setDisplayNoSubredditAlert] = useState(false);
    const [displayServerErrorAlert, setDisplayServerErrorAlert] = useState(false);
    const dispatch = useDispatch();
    const userSubscriptions = useSelector((state) => state.user.subscriptions);

    useEffect(() => {
        if (userSubscriptions !== null) {
            apiService
                .getHomePagePosts("day")
                .then((res) => {
                    setDisplayNoSubredditAlert(false);
                    setDisplayServerErrorAlert(false);
                    setSubredditPosts(res.data);
                    if (res.status === 204) {
                        setSubredditPosts(null);
                        setDisplayNoSubredditAlert(true);
                    }
                })
                .catch((err) => {
                    console.error("ERROR getting home page posts", err.response);
                    setDisplayNoSubredditAlert(false);

                    setSubredditPosts(null);
                    if (err.response.data.code === "user_not_found") {
                        localStorage.removeItem("user");
                        dispatch(userActions.logout());
                        window.location.reload();
                    } else {
                        setDisplayServerErrorAlert(true);
                    }
                });
        }
    }, [userSubscriptions, dispatch]);

    return (
        <Box>
            {displayNoSubredditAlert && (
                <Alert severity="info" color="primary">
                    <AlertTitle>No Subreddits</AlertTitle>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Box>Add one in the side menu (top-left)</Box>
                        <MenuIcon />
                    </Stack>
                </Alert>
            )}
            {displayServerErrorAlert && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    There was an issue retrieving updated posts from{" "}
                    <Link href="https://www.reddit.com/">Reddit</Link>. In the meantime, please
                    check <Link href="https://www.redditstatus.com/">redditstatus.com</Link> to see
                    if others are affected. Thank you!
                </Alert>
            )}
            {/* If subredditPosts is not loaded, provide empty (2D) Array 
            to map function in order to properly display loading skeletons */}
            {subredditPosts === null
                ? null
                : (Object.keys(subredditPosts).length === 0
                      ? [...Array(3)].map((e) => new Array(2))
                      : Object.entries(subredditPosts)
                  ).map(([subreddit, posts], index) => (
                      <Box sx={{ pt: index === 0 ? 0 : 1 }} key={index}>
                          {subreddit ? (
                              <Typography
                                  variant="panel_section_title"
                                  component="h3"
                                  color="primary"
                                  sx={{ mb: { xs: 0.2, md: 0.5 } }}
                              >
                                  <Link
                                      component={RouterLink}
                                      to={`/reddit/subreddits/${utilsService.removeSubredditPrefix(
                                          subreddit
                                      )}`}
                                      underline="hover"
                                      color="inherit"
                                  >
                                      {subreddit}
                                  </Link>
                              </Typography>
                          ) : (
                              <Skeleton
                                  variant="text"
                                  width={"30%"}
                                  height={45}
                                  sx={{ mb: 0.5, mt: 2 }}
                              />
                          )}
                          <Divider />

                          <Stack spacing={0}>
                              {(posts ? posts : [...Array(2)]).map((post, index) =>
                                  post ? (
                                      <PostPreviewCard postDetail={post} key={index} />
                                  ) : (
                                      <Skeleton
                                          variant="rounded"
                                          height={100}
                                          key={index}
                                          sx={{ mt: 2.5 }}
                                      />
                                  )
                              )}
                          </Stack>
                      </Box>
                  ))}
        </Box>
    );
}

export default RedditHome;
