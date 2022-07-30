import axios from 'axios'
import store from '../store/index';

const baseUrl = 'http://127.0.0.1:8000/api'

function getTopPosts(subreddit, timeFilter, numPosts) {
    return axios.get(`${baseUrl}/subreddits/${subreddit}/top-posts`, {
        params: {
            n: numPosts,
            time_filter: timeFilter
        }
    });
}

function getPost(postId) {
    return axios.get(`${baseUrl}/posts/${postId}`);
}

function getHomePagePosts(timeFilter) {
    return axios.get(`${baseUrl}/posts/homepage`, {
        params: {
            time_filter: timeFilter
        }
    });
}

function getUserSubscriptions() {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.get(`${baseUrl}/users/subscriptions`, requestConfig);
}

const exportedFunctions = {
    getTopPosts,
    getPost,
    getHomePagePosts,
    getUserSubscriptions,
};


export default exportedFunctions;
