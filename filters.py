def normalize_field_name(snake_case_str):
    words = snake_case_str.split('_')
    human_readable_words = [word.capitalize() for word in words]
    human_readable_str = ' '.join(human_readable_words)
    return human_readable_str