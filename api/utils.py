def normalize_text_content(text):
    text = text.replace('&#x200B;', '')
    return text.strip()
