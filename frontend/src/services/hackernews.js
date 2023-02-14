import axios from "axios";

const baseUrl = "/api/hackernews";

export function getHackernewsPosts(sortType) {
    return axios.get(`${baseUrl}/posts`, {
        params: {
            sort_type: sortType,
        },
    });
}

export function getHackernewsPostDetails(postId) {
    return axios.get(`${baseUrl}/posts/${postId}`);
}

export function getHackernewsCommentDetails(commentId) {
    return axios.get(`${baseUrl}/comments/${commentId}`);
}
