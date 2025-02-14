import requests
from bs4 import BeautifulSoup
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

from link_scraping import scrape_links
from contact_info import extract_contact_info

def scrape_data(url):
    """Comprehensive web scraping with contact info extraction."""
    raw_texts, contact_info = [], {}
    links = scrape_links(url)
    
    for link in links:
        try:
            response = requests.get(link)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract text from relevant tags
            page_text = " ".join(
                paragraph.get_text() 
                for paragraph in soup.find_all(['p', 'h1', 'h2', 'h3'])
            )
            
            raw_texts.append(page_text)
            page_contact_info = extract_contact_info(page_text)
            
            # Merge contact info, avoiding duplicates
            for key, value in page_contact_info.items():
                contact_info[key] = list(set(contact_info.get(key, []) + value))
            
        except requests.exceptions.RequestException:
            continue
    
    return raw_texts, contact_info

def process_scraped_data(texts):
    """Process scraped text into searchable chunks."""
    try:
        # Convert texts to string if it's a list
        if isinstance(texts, list):
            text_content = " ".join(str(text) for text in texts)
        else:
            text_content = str(texts)
            
        text_splitter = CharacterTextSplitter(
            separator="\n", 
            chunk_size=800, 
            chunk_overlap=200, 
            length_function=len
        )
        
        # Split text into chunks
        text_chunks = text_splitter.split_text(text_content)
        
        # Create embeddings
        embeddings = OpenAIEmbeddings()
        
        # Create and return FAISS index
        return FAISS.from_texts(text_chunks, embeddings)
        
    except Exception as e:
        raise Exception(f"Error processing text: {str(e)}")