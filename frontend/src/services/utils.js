import moment from 'moment';

function getRelativeTime(timestamp) {
    if (!timestamp) {
        return '';
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
  
    return url.protocol === 'http:' || url.protocol === 'https:';
}

function removeSubredditPrefix(subreddit_with_prefix) {
    return subreddit_with_prefix.slice(2);
}

const exportedFunctions = {
    getRelativeTime,
    isValidHttpUrl,
    removeSubredditPrefix,
};

export default exportedFunctions;
