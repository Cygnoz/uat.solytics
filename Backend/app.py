import logging
import os
from flask import Flask, request, jsonify
import pickle
from dotenv import load_dotenv
from pymongo import MongoClient
import openai
import faiss
from langchain_community.vectorstores.faiss import FAISS
from bson import ObjectId
from datetime import datetime
import requests
import json
from PyPDF2 import PdfReader
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from werkzeug.security import generate_password_hash,check_password_hash

# Import custom modules
from file_processing import process_uploaded_file
from data_processing import scrape_data, process_scraped_data
from response_handling import ResponseHandler
from embed_handling import ModelManager
from voice_handler import VoiceHandler
from framework import create_custom_framework,get_custom_framework
from connection import get_database

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

# Configure MongoDB
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["chatbot_db"]
chatbots_collection = db["chatbots"]

# Configure OpenAI
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is missing in the environment variables")
openai.api_key = api_key

# Initialize helper classes
response_handler = ResponseHandler()
model_manager = ModelManager()
voice_handler = VoiceHandler()

import os
import faiss
import numpy as np
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore


@app.route("/", methods=["GET"])
def status():
    return jsonify({"message": "Chatbot is working 🤖"}), 200

def save_faiss_index(faiss_index, bot_name):
    """Save FAISS index and its data for MongoDB storage"""
    try:
        # Create directory for FAISS indexes if it doesn't exist
        index_path = f"faiss_indexes/{bot_name}"
        os.makedirs(index_path, exist_ok=True)
        logging.info(f"Created directory: {index_path}")
        
        # Save the FAISS index
        index_file = f"{index_path}/index"
        faiss.write_index(faiss_index.index, index_file)
        logging.info(f"Saved FAISS index to: {index_file}")
        
        # Save the docstore and index_to_docstore_id mapping
        docstore_file = f"{index_path}/docstore.pkl"
        with open(docstore_file, "wb") as f:
            pickle.dump({
                'docstore': faiss_index.docstore._dict,
                'index_to_docstore_id': faiss_index.index_to_docstore_id
            }, f)
        logging.info(f"Saved docstore to: {docstore_file}")
        
        index_data = {
            'index_directory': index_path,
            'embedding_type': 'OpenAIEmbeddings'
        }
        
        return index_data
    except Exception as e:
        logging.error(f"Error saving FAISS index: {str(e)}")
        raise e

def load_faiss_index(index_data):
    """Load FAISS index from saved data"""
    try:
        index_directory = index_data['index_directory']
        
        # Check if directory exists
        if not os.path.exists(index_directory):
            raise FileNotFoundError(f"Index directory {index_directory} does not exist")
            
        # Load the FAISS index
        index_path = f"{index_directory}/index"
        docstore_path = f"{index_directory}/docstore.pkl"
        
        if not os.path.exists(index_path):
            raise FileNotFoundError(f"Index file {index_path} does not exist")
        if not os.path.exists(docstore_path):
            raise FileNotFoundError(f"Docstore file {docstore_path} does not exist")
            
        # Load the index
        embeddings = OpenAIEmbeddings()
        index = faiss.read_index(index_path)
        
        # Load the docstore
        with open(docstore_path, 'rb') as f:
            docstore_data = pickle.load(f)
            
        # Reconstruct the FAISS object
        faiss_index = FAISS(
            embeddings.embed_query,
            index,
            docstore_data['docstore'],
            docstore_data['index_to_docstore_id']
        )
        
        return faiss_index
        
    except Exception as e:
        logging.error(f"Error loading FAISS index: {str(e)}")
        raise e

@app.route("/create_chatbot", methods=["POST"])
def create_chatbot():
    """Endpoint to create a new chatbot."""
    try:
        # Debug logging
        logging.info("Starting chatbot creation...")
        
        # Check if file is present
        if 'file' not in request.files:
            logging.error("No file in request")
            return jsonify({
                "error": "No file uploaded"
            }), 400

        file = request.files['file']
        bot_name = "PDFBot"  # Default bot name

        if not file or file.filename == '':
            logging.error("Empty file selected")
            return jsonify({
                "error": "No file selected"
            }), 400

        if not file.filename.endswith('.pdf'):
            logging.error(f"Invalid file type: {file.filename}")
            return jsonify({
                "error": "Invalid file format. Please upload a PDF file."
            }), 400

        try:
            # Read PDF content
            logging.info("Reading PDF content...")
            pdf_reader = PdfReader(file)
            text_content = ""
            for page in pdf_reader.pages:
                text_content += page.extract_text() + "\n"
            
            if not text_content.strip():
                logging.error("PDF content is empty")
                return jsonify({
                    "error": "PDF appears to be empty or unreadable"
                }), 400

            logging.info(f"Extracted {len(text_content)} characters from PDF")
            
            # Split text into chunks
            text_splitter = CharacterTextSplitter(
                separator="\n",
                chunk_size=800,
                chunk_overlap=200,
                length_function=len
            )
            chunks = text_splitter.split_text(text_content)
            logging.info(f"Split text into {len(chunks)} chunks")

            # Create embeddings
            logging.info("Creating embeddings...")
            embeddings = OpenAIEmbeddings()
            
            # Create FAISS index
            logging.info("Creating FAISS index...")
            document_search = FAISS.from_texts(chunks, embeddings)
            
            # Save the index
            index_path = os.path.join("faiss_indexes", bot_name)
            os.makedirs(index_path, exist_ok=True)
            logging.info(f"Saving index to {index_path}")
            document_search.save_local(index_path)
            
            # Verify index was saved
            if not os.path.exists(os.path.join(index_path, "index.faiss")):
                logging.error("Index file not created")
                return jsonify({
                    "error": "Failed to save search index"
                }), 500
                
            logging.info("Chatbot created successfully")
            return jsonify({
                "message": "Chatbot created successfully",
                "bot_name": bot_name,
                "index_path": index_path
            }), 200
            
        except Exception as e:
            logging.error(f"PDF processing error: {str(e)}")
            return jsonify({
                "error": f"Error processing PDF: {str(e)}"
            }), 400

    except Exception as e:
        logging.error(f"Error creating chatbot: {str(e)}")
        return jsonify({
            "error": f"Failed to create chatbot: {str(e)}"
        }), 500

def process_scraped_data(text):
    """Process text data and create FAISS index"""
    try:
        if not text or not isinstance(text, str):
            raise ValueError("Invalid input: text must be a non-empty string")

        # Split text into smaller chunks
        from langchain.text_splitter import CharacterTextSplitter
        
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        texts = text_splitter.split_text(text)
        
        if not texts:
            raise ValueError("No text chunks were generated")

        # Create embeddings
        embeddings = OpenAIEmbeddings()
        
        # Create FAISS index
        faiss_index = FAISS.from_texts(texts, embeddings)
        
        return faiss_index
        
    except Exception as e:
        logging.error(f"Error processing text: {str(e)}")
        raise e

from langchain.chains import ConversationalRetrievalChain
from langchain_openai import ChatOpenAI
import logging

@app.route("/chat", methods=["POST"])
def chat():
    """Endpoint to handle chat interactions."""
    try:
        logging.info("Processing chat request...")
        
        if not request.is_json:
            return jsonify({
                "error": "Content-Type must be application/json"
            }), 415

        data = request.get_json()
        
        if not data.get("message") or not data.get("bot_name"):
            return jsonify({
                "error": "Missing required fields",
                "required": ["message", "bot_name"]
            }), 400

        bot_name = data["bot_name"]
        message = data["message"]

        # Check if bot exists
        index_path = os.path.join("faiss_indexes", bot_name)
        logging.info(f"Looking for index at {index_path}")
        
        if not os.path.exists(index_path) or not os.path.exists(os.path.join(index_path, "index.faiss")):
            logging.error(f"Index not found at {index_path}")
            return jsonify({
                "error": "Bot not found",
                "message": f"No training data found for bot: {bot_name}",
                "expected_path": index_path
            }), 404

        try:
            # Load the saved index
            logging.info("Loading FAISS index...")
            embeddings = OpenAIEmbeddings()
            document_search = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
            
            # Search for similar content
            logging.info("Searching for relevant content...")
            docs = document_search.similarity_search(message)
            
            # Generate response
            if docs:
                response = docs[0].page_content
                logging.info("Found relevant content")
            else:
                response = "I couldn't find relevant information in the document."
                logging.info("No relevant content found")
            
            return jsonify({
                "response": response
            }), 200

        except Exception as e:
            logging.error(f"Chat error: {str(e)}")
            return jsonify({
                "error": "Failed to process chat",
                "message": str(e)
            }), 500

    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

def save_faiss_index(faiss_index, bot_name):
    """Save FAISS index and its data for MongoDB storage"""
    try:
        # Create directory for FAISS indexes if it doesn't exist
        index_path = f"faiss_indexes/{bot_name}"
        os.makedirs(index_path, exist_ok=True)
        logging.info(f"Created directory: {index_path}")
        
        # Save the FAISS index
        index_file = f"{index_path}/index"
        faiss.write_index(faiss_index.index, index_file)
        logging.info(f"Saved FAISS index to: {index_file}")
        
        # Save the docstore and index_to_docstore_id mapping
        docstore_file = f"{index_path}/docstore.pkl"
        with open(docstore_file, "wb") as f:
            pickle.dump({
                'docstore': faiss_index.docstore._dict,
                'index_to_docstore_id': faiss_index.index_to_docstore_id
            }, f)
        logging.info(f"Saved docstore to: {docstore_file}")
        
        index_data = {
            'index_directory': index_path,
            'embedding_type': 'OpenAIEmbeddings'
        }
        
        return index_data
    except Exception as e:
        logging.error(f"Error saving FAISS index: {str(e)}")
        raise e

def load_faiss_index(index_data):
    """Load FAISS index from stored data"""
    from langchain.docstore.document import Document
    from langchain.docstore.in_memory import InMemoryDocstore
    
    index_directory = index_data['index_directory']
    
    # Recreate the embedding function
    embedding_function = OpenAIEmbeddings()
    
    # Load the FAISS index
    index = faiss.read_index(f"{index_directory}/index")
    
    # Load the docstore and mapping
    with open(f"{index_directory}/docstore.pkl", "rb") as f:
        stored_data = pickle.load(f)
        docstore_dict = stored_data['docstore']
        index_to_docstore_id = stored_data['index_to_docstore_id']
    
    # Convert the docstore dict to Document objects if needed
    docstore = InMemoryDocstore({})
    for k, v in docstore_dict.items():
        if not isinstance(v, Document):
            docstore._dict[k] = Document(page_content=v)
        else:
            docstore._dict[k] = v
    
    # Recreate the FAISS object with all required parameters
    faiss_index = FAISS(
        embedding_function=embedding_function,
        index=index,
        docstore=docstore,
        index_to_docstore_id=index_to_docstore_id
    )
    
    return faiss_index

@app.route("/create_framework", methods=["POST"])
def create_framework():
    try:
        data = request.get_json()
        framework = create_custom_framework(
            project_name=data["project_name"],
            input_fields=data["input_fields"],
            upload_fields=data["upload_fields"],
            choice_fields=data["choice_fields"],
            boat_name=data["boat_name"],
            boat_iframeurl=data["boat_iframeurl"],
            qa=data["qa"],
            port_number=data["port_number"]
        )
        return jsonify({
            "message": "Framework created successfully",
            "framework": str(framework)
        }), 200
    except Exception as e:
        logging.error(f"Error creating framework: {str(e)}")
        return jsonify({
            "error": "Failed to create framework",
            "message": str(e)
        }), 500

@app.route("/get_framework/<project_name>", methods=["GET"])
def get_framework(project_name):
    try:
        print("project name---", project_name)
        framework = get_custom_framework(project_name)

        return jsonify({
            "message": "Framework retrieved successfully",
            "framework": framework
        }), 200
    except Exception as e:
        logging.error(f"Error retrieving framework: {str(e)}")
        return jsonify({
            "error": "Failed to retrieve framework",
            "message": str(e)
        }), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    db = get_database()
    users_collection = db['users']

    # Encrypt the password
    hashed_password = generate_password_hash(password)

    # Insert the user into the database
    users_collection.insert_one({"username": username, "password": hashed_password})

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    db = get_database()
    users_collection = db['users']

    # Find user by username
    user = users_collection.find_one({"username": username})

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    # Check if the provided password matches the hashed password
    if not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Generate a success message or token if authentication succeeds
    return jsonify({"message": "Login successful"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

