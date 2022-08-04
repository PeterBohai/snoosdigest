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

function postUserSubscriptions(subreddit_name) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    const postData = {
        subreddit: subreddit_name,
    }
    return axios.post(`${baseUrl}/users/subscriptions`, postData, requestConfig)
}

function getHomePagePosts(timeFilter) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {
        params: { time_filter: timeFilter }
    };
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.get(`${baseUrl}/posts/homepage`, requestConfig);
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
    postUserSubscriptions,
};


export default exportedFunctions;
