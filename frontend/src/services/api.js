import axios from "axios";
import store from "../store/index";

const baseUrl = "/api";

function getTopPosts(subreddit, timeFilter, numPosts) {
    return axios.get(`${baseUrl}/reddit/subreddits/${subreddit}/top-posts`, {
        params: {
            n: numPosts,
            time_filter: timeFilter,
        },
    });
}

function getPost(postId, appName) {
    return axios.get(`${baseUrl}/${appName}/posts/${postId}`);
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
    };
    return axios.post(`${baseUrl}/users/subscriptions`, postData, requestConfig);
}

function getHomePagePosts(timeFilter) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {
        params: { time_filter: timeFilter },
    };
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.get(`${baseUrl}/reddit/posts/homepage`, requestConfig);
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
    };
    return axios.delete(`${baseUrl}/users/subscriptions`, { ...requestConfig, data: postData });
}

function postUpdateUserPassword(updatePasswordData) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.post(`${baseUrl}/users/update-password`, updatePasswordData, requestConfig);
}

function getUserProfile(access_token) {
    const storeState = store.getState();
    const userData = storeState.user.userData;

    if (typeof access_token === "undefined") {
        access_token = userData.access;
    }

    const requestConfig = {};
    if (access_token || userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${access_token}` };
    }
    return axios.get(`${baseUrl}/users/profile`, requestConfig);
}

function deleteUserProfile() {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.delete(`${baseUrl}/users/profile`, requestConfig);
}

function putUserProfile(profileData) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.put(`${baseUrl}/users/profile`, profileData, requestConfig);
}

function getSubredditOptions() {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    const requestConfig = {};
    if (userData) {
        // Send JWT access token through the Authorization header for server to authenticate and identify the user
        requestConfig.headers = { Authorization: `Bearer ${userData.access}` };
    }
    return axios.get(`${baseUrl}/reddit/subreddits`, requestConfig);
}

function postResetUserPasswordEmail(emailFormData) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    if (userData) {
        throw new Error("Cannot send reset password request if logged in!");
    }
    return axios.post(`${baseUrl}/users/reset-password`, emailFormData);
}

function postResetUserPassword(emailFormData) {
    const storeState = store.getState();
    const userData = storeState.user.userData;
    if (userData) {
        throw new Error("Cannot send reset password request if logged in!");
    }
    return axios.post(`${baseUrl}/users/reset-password-confirmation`, emailFormData);
}

const exportedFunctions = {
    getTopPosts,
    getPost,
    getHomePagePosts,
    getUserSubscriptions,
    postUserSubscriptions,
    deleteUserSubscriptions,
    postUpdateUserPassword,
    getUserProfile,
    putUserProfile,
    deleteUserProfile,
    getSubredditOptions,
    postResetUserPasswordEmail,
    postResetUserPassword,
};

export default exportedFunctions;
