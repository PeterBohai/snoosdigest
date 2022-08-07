import axios from 'axios'
import store from '../store/index';

const baseUrl = '/api'

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

function deleteUserSubscriptions(subreddit_name_prefixed) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    const postData = {
        subreddit: subreddit_name_prefixed.slice(2),
    }
    return axios.delete(`${baseUrl}/users/subscriptions`, {...requestConfig, data: postData});
}

const exportedFunctions = {
    getTopPosts,
    getPost,
    getHomePagePosts,
    getUserSubscriptions,
    postUserSubscriptions,
    deleteUserSubscriptions,
};


export default exportedFunctions;
