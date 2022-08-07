import os
from datetime import timedelta

MAX_NUM_POSTS_PER_SUBREDDIT = 5
MAX_SUBREDDIT_UPDATE_GAP = timedelta(minutes=int(os.environ.get('MAX_SUBREDDIT_UPDATE_GAP')))
DEFAULT_SUBSCRIPTIONS = ['news', 'personalfinance', 'investing', ]
