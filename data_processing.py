from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings

def process_scraped_data(texts):
    """
    Process scraped text data to generate embeddings for similarity search.

    Args:
        texts (list): A list of strings containing the scraped data.

    Returns:
        FAISS: A FAISS vector store for similarity search.
    """
    if not texts or not isinstance(texts, list):
        raise ValueError("Input must be a non-empty list of texts.")
    
    # Split the text into chunks
    text_splitter = CharacterTextSplitter(separator="\n", chunk_size=800, chunk_overlap=200, length_function=len)
    split_texts = text_splitter.split_text("\n".join(texts))

    # Generate embeddings
    embeddings = OpenAIEmbeddings()
    return FAISS.from_texts(split_texts, embeddings)
