import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/api'

function getTopPosts(subreddit, timeFilter, numPosts) {
    return axios.get(`${baseUrl}/subreddit/${subreddit}/top-posts`, {
        params: {
            n: numPosts,
            time_filter: timeFilter
        }
    })
}

export default {
    getTopPosts: getTopPosts,
};
