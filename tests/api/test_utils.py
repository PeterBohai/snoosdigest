from api import utils


def test_normalize_text_content() -> None:
    normalized_test = "This is a test"
    assert utils.normalize_text_content(" This is a test    ") == normalized_test
    assert utils.normalize_text_content("This is &#x200B;a test") == normalized_test
    assert utils.normalize_text_content("    This&#x200B; is &#x200B;a test ") == normalized_test


def test_generate_full_reddit_link() -> None:
    permalink_example = " /r/Bogleheads/comments/ujsdd1/warren_buffett_give_your_money_to_monkeys/ "
    assert utils.generate_full_reddit_link(permalink_example) == (
        "https://www.reddit.com/r/Bogleheads/comments/ujsdd1/"
        "warren_buffett_give_your_money_to_monkeys/"
    )


def test_generate_reddit_link_from_id() -> None:
    id_example = "xfu76k"
    assert utils.generate_reddit_link_from_id(f" {id_example}  ") == f"https://redd.it/{id_example}"
