import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import PostPreviewCard from '../components/PostPreviewCard';
import apiService from '../services/api';
import configService from '../services/config';
import utilsService from '../services/utils';

function HomeScreen() {
    const [subredditPosts, setSubredditPosts] = useState({});
    const userSubscriptions = useSelector((state) => state.user.subscriptions);

    useEffect(() => {
        apiService.getHomePagePosts('day').then((res) => {
            console.log(res);
            setSubredditPosts(res.data);
            if (res.status === 204) {
                setSubredditPosts(null);
            }
        });
    }, [userSubscriptions]);

    let theme = createTheme(configService.baseTheme);
    theme = responsiveFontSizes(theme);

    return (
        <div>
            <Container>
                <ThemeProvider theme={theme}>
                    {/* If subredditPosts is not loaded, provide empty (2D) Array to map function in order to properly display loading skeletons */}
                    {subredditPosts === null
                        ? null
                        : (Object.keys(subredditPosts).length === 0
                              ? [...Array(3)].map((e) => new Array(2))
                              : Object.entries(subredditPosts)
                          ).map(([subreddit, posts], index) => (
                              <Box sx={{ pt: 3, pb: 3 }} key={index}>
                                  {subreddit ? (
                                      <Typography
                                          gutterBottom
                                          variant="h4"
                                          component="h4"
                                          color="primary"
                                          sx={{ fontWeight: 'bold' }}
                                      >
                                          <Link
                                              component={RouterLink}
                                              to={`/subreddits/${utilsService.removeSubredditPrefix(
                                                  subreddit
                                              )}`}
                                              underline="hover"
                                              color="inherit"
                                          >
                                              {subreddit}
                                          </Link>
                                      </Typography>
                                  ) : (
                                      <Skeleton variant="text" width={210} height={64} />
                                  )}
                                  {
                                      <Stack spacing={3}>
                                          {(posts ? posts : [...Array(2)]).map((post, index) =>
                                              post ? (
                                                  <PostPreviewCard post={post} key={index} />
                                              ) : (
                                                  <Skeleton
                                                      variant="rectangular"
                                                      height={168}
                                                      key={index}
                                                  />
                                              )
                                          )}
                                      </Stack>
                                  }
                              </Box>
                          ))}
                </ThemeProvider>
            </Container>
        </div>
    );
}

export default HomeScreen;
