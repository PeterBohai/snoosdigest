def normalize_text_content(text: str) -> str:
    text = text.replace('&#x200B;', '')
    return text.strip()


def generate_full_reddit_link(link_path: str) -> str:
    return f'https://www.reddit.com{link_path.strip()}'.strip()


def generate_reddit_link_from_id(reddit_id: str) -> str:
    return f'https://redd.it/{reddit_id.strip()}'.strip()
