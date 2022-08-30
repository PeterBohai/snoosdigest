import moment from "moment";

function getRelativeTime(timestamp) {
    if (!timestamp) {
        return "";
    }
    let dateTime = moment.unix(timestamp).utc();
    return dateTime.fromNow();
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function removeSubredditPrefix(subreddit_with_prefix) {
    return subreddit_with_prefix.slice(2);
}

function formatNumber(num) {
    if (num >= 10000) {
        num = (Math.round((num / 1000 + Number.EPSILON) * 10) / 10).toFixed(1);
        return `${num}k`;
    }
    return num;
}

function validatePasswordConditions(password) {
    return /[A-Za-z0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
}

const exportedFunctions = {
    getRelativeTime,
    isValidHttpUrl,
    removeSubredditPrefix,
    formatNumber,
    validatePasswordConditions,
};

export default exportedFunctions;
