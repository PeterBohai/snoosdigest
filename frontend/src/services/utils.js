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

const exportedFunctions = {
    getRelativeTime,
    isValidHttpUrl,
};

export default exportedFunctions;
