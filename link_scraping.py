import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_links(url):
    """
    Scrape links and contact info from a webpage.

    Args:
        url (str): The URL of the webpage to scrape.

    Returns:
        tuple: A set of links and a dictionary of contact info (emails, phone numbers).
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract all valid links
        links = {
            urljoin(url, anchor["href"])
            for anchor in soup.find_all("a", href=True)
            if not any(prefix in urljoin(url, anchor["href"]) for prefix in ['mailto:', 'tel:'])
        }

        # Extract contact information
        contact_info = {
            "emails": {
                anchor["href"].replace("mailto:", "")
                for anchor in soup.find_all("a", href=True)
                if anchor["href"].startswith("mailto:")
            },
            "phone_numbers": {
                anchor["href"].replace("tel:", "")
                for anchor in soup.find_all("a", href=True)
                if anchor["href"].startswith("tel:")
            },
        }

        return links, contact_info
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Error scraping links from {url}: {e}")
