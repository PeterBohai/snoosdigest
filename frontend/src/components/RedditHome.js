import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";

import PostPreviewCard from "../components/PostPreviewCard";
import apiService from "../services/api";
import utilsService from "../services/utils";
import { userActions } from "../store/userSlice";

function RedditHome() {
    const [subredditPosts, setSubredditPosts] = useState({});
    const dispatch = useDispatch();
    const userSubscriptions = useSelector((state) => state.user.subscriptions);

    useEffect(() => {
        apiService
            .getHomePagePosts("day")
            .then((res) => {
                setSubredditPosts(res.data);
                console.log(res.data);
                if (res.status === 204) {
                    setSubredditPosts(null);
                }
            })
            .catch((err) => {
                console.error("ERROR getting home page posts", err.response.data);
                if (err.response.data.code === "user_not_found") {
                    localStorage.removeItem("user");
                    dispatch(userActions.logout());
                    window.location.reload();
                }
            });
    }, [userSubscriptions, dispatch]);

    return (
        <Box>
            {/* If subredditPosts is not loaded, provide empty (2D) Array 
            to map function in order to properly display loading skeletons */}
            {subredditPosts === null
                ? null
                : (Object.keys(subredditPosts).length === 0
                      ? [...Array(3)].map((e) => new Array(2))
                      : Object.entries(subredditPosts)
                  ).map(([subreddit, posts], index) => (
                      <Box sx={{ pt: index === 0 ? 0 : 3 }} key={index}>
                          {subreddit ? (
                              <Typography gutterBottom variant="h3" component="h3" color="primary">
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
                              <Skeleton variant="text" width={310} height={54} sx={{ mb: 2 }} />
                          )}
                          <Divider />
                          {
                              <Stack spacing={posts ? 1 : 4}>
                                  {(posts ? posts : [...Array(2)]).map((post, index) =>
                                      post ? (
                                          <PostPreviewCard postDetail={post} key={index} />
                                      ) : (
                                          <Skeleton
                                              variant="rounded"
                                              height={130}
                                              key={index}
                                              sx={{ mt: 2 }}
                                          />
                                      )
                                  )}
                              </Stack>
                          }
                      </Box>
                  ))}
        </Box>
    );
}

export default RedditHome;
