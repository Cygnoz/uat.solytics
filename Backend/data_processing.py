# data_processing.py
 
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
import logging
 
from link_scraping import scrape_links
from contact_info import extract_contact_info
 
def is_valid_url(url):
    """Validate URL format and accessibility."""
    if not url:
        return False
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False
 
def scrape_data(url):
    """Comprehensive web scraping with contact info extraction."""
    if not is_valid_url(url):
        raise ValueError(f"Invalid URL provided: {url}")
    raw_texts = []
    contact_info = {}
    try:
        # First, verify the URL is accessible
        response = requests.get(url)
        response.raise_for_status()
        # Get links from the main page
        links = scrape_links(url)
        if not links:
            # If no links found, at least process the main page
            links = {url}
        for link in links:
            try:
                response = requests.get(link)
                response.raise_for_status()
                soup = BeautifulSoup(response.content, 'html.parser')
                # Extract text from relevant tags
                page_text = " ".join(
                    paragraph.get_text().strip() 
                    for paragraph in soup.find_all(['p', 'h1', 'h2', 'h3'])
                    if paragraph.get_text().strip()
                )
                if page_text:
                    raw_texts.append(page_text)
                    page_contact_info = extract_contact_info(page_text)
                    # Merge contact info, avoiding duplicates
                    for key, value in page_contact_info.items():
                        contact_info[key] = list(set(contact_info.get(key, []) + value))
            except requests.exceptions.RequestException as e:
                logging.warning(f"Error scraping link {link}: {str(e)}")
                continue
        if not raw_texts:
            raise ValueError("No content could be scraped from the provided URL")
        return "\n\n".join(raw_texts), contact_info
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Error accessing URL {url}: {str(e)}")
 
def process_scraped_data(text):
    """Process text data and create FAISS index."""
    if not text:
        raise ValueError("No text provided for processing")
    # Ensure we're working with a string
    if isinstance(text, list):
        text = "\n\n".join(text)
    elif not isinstance(text, str):
        raise ValueError(f"Expected string or list, got {type(text)}")
    try:
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        texts = text_splitter.split_text(text)
        if not texts:
            raise ValueError("No valid text chunks created after splitting")
        embeddings = OpenAIEmbeddings()
        return FAISS.from_texts(texts, embeddings)
    except Exception as e:
        logging.error(f"Error processing text: {str(e)}")
        raise
 