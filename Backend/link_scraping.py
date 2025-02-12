import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_links(url):
    """Fetch all unique links from the provided URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        links = set(
            urljoin(url, anchor["href"]) 
            for anchor in soup.find_all("a", href=True) 
            if not any(prefix in urljoin(url, anchor["href"]) for prefix in ['mailto:', 'tel:'])
        )
        
        return links
    except requests.exceptions.RequestException as e:
        print(f"Error scraping links from {url}: {e}")
        return set()