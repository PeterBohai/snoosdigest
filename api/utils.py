def normalize_text_content(text: str):
    text = text.replace('&#x200B;', '')
    return text.strip()


def generate_full_reddit_link(link_path: str):
    return f'https://www.reddit.com{link_path}'.strip()


def generate_reddit_link_from_id(reddit_id: str):
    return f'https://redd.it/{reddit_id}'.strip()
