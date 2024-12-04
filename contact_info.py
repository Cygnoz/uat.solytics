import re

def extract_contact_info(texts):
    """
    Extract contact information from a list of texts.
    
    Args:
        texts (list): A list of text strings to extract contact info from.
    
    Returns:
        dict: A dictionary of extracted contact information.
    """
    if not texts or not isinstance(texts, (list, str)):
        return {
            "emails": [],
            "phone_numbers": [],
            "websites": [],
            "addresses": []
        }

    # Combine all texts into a single string
    combined_text = " ".join(texts) if isinstance(texts, list) else texts

    # Define regex patterns for different types of contact information
    patterns = {
        'emails': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        'phone_numbers': r'\b(?:\+\d{1,2}\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b',
        'websites': r'https?://(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:/\S*)?',
        'addresses': r'\d+\s+(?:[A-Za-z]+\s+)+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Square|Sq)\.?'
    }

    # Apply regex patterns and return results
    return {
        key: list(set(re.findall(pattern, combined_text, re.MULTILINE | re.IGNORECASE)))
        for key, pattern in patterns.items()
    }
