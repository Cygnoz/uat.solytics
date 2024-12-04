def generate_embed_codes(user_id):
    """
    Generate embed codes for a chatbot iframe and chat bubble.

    Args:
        user_id (str): Unique identifier for the user or chatbot instance.

    Returns:
        tuple: Contains iframe code and chat bubble code.
    """
    if not user_id or not isinstance(user_id, str):
        raise ValueError("User ID must be a valid non-empty string.")

    # Generate iframe embed code
    iframe_code = (
        f'<iframe src="https://yourdomain.com/chat/{user_id}" '
        'width="100%" style="height: 100%; min-height: 700px;" frameborder="0"></iframe>'
    )

    # Generate chat bubble embed code
    chat_bubble_code = f"""
    <script>
    window.embeddedChatbotConfig = {{
        chatbotId: "{user_id}",
        domain: "yourdomain.com"
    }};
    </script>
    <script src="https://yourdomain.com/embed.min.js" defer></script>
    """

    return iframe_code, chat_bubble_code
