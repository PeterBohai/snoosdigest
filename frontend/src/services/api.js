import axios from 'axios'

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

const exportedFunctions = {
    getTopPosts,
    getPost,
};


export default exportedFunctions;
