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

function getUserLetteredAvatar(userData) {
    if (!userData.first_name || !userData.last_name) {
        return userData["snoosdigest/username"][0].toUpperCase();
    }
    let result = "";
    if (userData.first_name) {
        result += userData.first_name[0];
    }
    if (userData.last_name) {
        result += userData.last_name[0];
    }
    return result.toUpperCase();
}

function getUserWelcomeName(userData) {
    if (!userData.first_name || !userData.last_name) {
        return userData["snoosdigest/username"].split("@")[0];
    }
    if (userData.first_name) {
        return userData.first_name;
    }
    if (userData.last_name) {
        return userData.first_name;
    }
    return "No Name :(";
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const exportedFunctions = {
    getRelativeTime,
    isValidHttpUrl,
    removeSubredditPrefix,
    formatNumber,
    validatePasswordConditions,
    getUserLetteredAvatar,
    getUserWelcomeName,
    sleep,
    validateEmail,
};

export default exportedFunctions;
