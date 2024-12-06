import re

def extract_contact_info(text):
    """Advanced contact information extraction."""
    contact_patterns = {
        "emails": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        "phone_numbers": r"\+?\(?\d{1,4}[\)\-\s]?\d{1,4}[\-\s]?\d{1,4}[\-\s]?\d{1,4}",
        "addresses": r"\d+\s[\w\s]+,?\s[\w\s]+,?\s[\w\s]+"
    }
    
    return {
        key: list(set(re.findall(pattern, text, re.MULTILINE)))
        for key, pattern in contact_patterns.items()
    }