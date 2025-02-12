# import os
# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# import openai
# from pymongo import MongoClient
# import json
# import base64
# import faiss
# import logging

# # Import custom modules
# from file_processing import process_uploaded_file
# from data_processing import scrape_data, process_scraped_data
# from response_handling import ResponseHandler
# from embed_handling import ModelManager
# from voice_handler import VoiceHandler

# # Load environment variables from the .env file
# load_dotenv()

# # Initialize Flask app and connect to MongoDB
# app = Flask(__name__)
# mongo_client = MongoClient(os.getenv("MONGO_URI"))
# db = mongo_client["chatbot_db"]
# chatbots_collection = db["chatbots"]

# # Load the OpenAI API key from environment variables
# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     raise ValueError("OPENAI_API_KEY is missing in the environment variables")
# openai.api_key = api_key

# # Initialize helper classes for processing responses, models, and voice inputs
# response_handler = ResponseHandler()
# model_manager = ModelManager()
# voice_handler = VoiceHandler()

# @app.route("/train", methods=["POST"])
# def train_bot():
#     """
#     Train the chatbot using one of the following methods:
#     - Website URL: Scrape data from the given URL
#     - Document Upload: Process an uploaded document (base64 encoded)
#     - Manual Input: Process user-provided text

#     Expected JSON:
#     {
#         "bot_name": "Chatbot",
#         "training_type": "Website URL" | "Document Upload" | "Manual Input",
#         "data": "URL or manual text or uploaded file (base64)"
#     }
#     """
#     data = request.json
#     bot_name = data.get("bot_name", "Chatbot")  # Default bot name is 'Chatbot'
#     training_type = data.get("training_type")
#     training_data = data.get("data")

#     if not training_type or not training_data:
#         return jsonify({"error": "Training type and data are required"}), 400

#     try:
#         if training_type == "Website URL":
#             scraped_texts, contact_info = scrape_data(training_data)
#             document_search = process_scraped_data(scraped_texts)
#         elif training_type == "Document Upload":
#             file_texts = process_uploaded_file(training_data)
#             document_search = process_scraped_data(file_texts)
#         elif training_type == "Manual Input":
#             manual_texts = training_data.splitlines()
#             document_search = process_scraped_data(manual_texts)
#         else:
#             return jsonify({"error": "Invalid training type"}), 400

#         # Serialize the document_search object
#         document_search_serialized = serialize_document_search(document_search)

#         # Store chatbot data in MongoDB
#         chatbot_data = {
#             'bot_name': bot_name,
#             'training_type': training_type,
#             'training_data': training_data,
#             'document_search': document_search_serialized
#         }
#         chatbots_collection.insert_one(chatbot_data)

#         return jsonify({"message": f"Training data for {bot_name} has been successfully added."}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/chat", methods=["POST"])
# def chat():
#     """
#     Chat with the bot.
#     """
#     data = request.json
#     bot_name = data.get("bot_name", "Chatbot")
#     user_input = data.get("user_input", "").strip()
#     document_search_serialized = data.get("document_search", None)
#     print("bot_name",bot_name,"\n user_input",user_input)
    
#     if not user_input:
#         return jsonify({"error": "User input is required"}), 400
    
#     try:
#         # Retrieve bot data from MongoDB
#         bot_data = chatbots_collection.find_one({"bot_name": bot_name})
#         if not bot_data:
#             return jsonify({"error": "Bot data not found"}), 404
        
#         # Debugging: Log the bot_data
#         logging.debug(f"Bot data: {bot_data}")
        
#         processed_data = bot_data.get("processed_data")
#         print( "\n processed_data",processed_data)
        
#         # Debugging: Log the processed_data
#         logging.debug(f"Processed data: {processed_data}")
        
#         if not processed_data:
#             return jsonify({"bot_response": "Please provide training data via a website, document upload, or manual input."}), 400
        
#         # Deserialize the document_search object
#         document_search = deserialize_document_search(processed_data)
#         print("\n document_search",document_search)
        
#         bot_response = response_handler.get_response(user_input, bot_name, document_search)
#         return jsonify({
#             "user_input": user_input,
#             "bot_response": bot_response
#         }), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def serialize_document_search(document_search):
#     # Implement serialization logic for the document_search object
#     # Convert the FAISS object to a dictionary or another serializable format
#     def default_serializer(obj):
#         if isinstance(obj, faiss.Index):
#             return base64.b64encode(faiss.serialize_index(obj)).decode('utf-8')
#         if isinstance(obj, (dict, list, str, int, float, bool, type(None))):
#             return obj
#         return str(obj)  # Fallback for non-serializable objects

#     return json.dumps(document_search, default=default_serializer)

# def deserialize_document_search(document_search_serialized):
#     # Implement deserialization logic for the document_search object
#     # Convert the serialized format back to the original object
#     def default_deserializer(obj):
#         if isinstance(obj, str):
#             try:
#                 return faiss.deserialize_index(base64.b64decode(obj.encode('utf-8')))
#             except Exception:
#                 return obj
#         return obj

#     return json.loads(document_search_serialized, object_hook=default_deserializer)

# @app.route("/chats", methods=["GET"])
# def get_chats():
#     """
#     Retrieve the chat history for a specific bot.

#     Query Parameters:
#         - bot_name: The name of the bot whose chat history is to be retrieved
#     """
#     bot_name = request.args.get("bot_name")

#     if not bot_name:
#         return jsonify({"error": "Bot name is required"}), 400

#     try:
#         # Fetch all chat records for the specified bot
#         chats = list(db.chats.find({"bot_name": bot_name}, {"_id": 0}))
#         return jsonify({"chats": chats}), 200

#     except Exception as e:
#         # Handle errors and return a 500 response with the error message
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     # Start the Flask app, accessible on all network interfaces at port 5000
#     app.run(host="0.0.0.0", port=5001,debug=True)  

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

# Import custom modules
from file_processing import process_uploaded_file
from data_processing import scrape_data, process_scraped_data
from response_handling import ResponseHandler
from embed_handling import ModelManager
from voice_handler import VoiceHandler
from data_processing import is_valid_url

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
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

def save_faiss_index(faiss_index, bot_name):
    """Save FAISS index and its data for MongoDB storage"""
    # Create directory for FAISS indexes if it doesn't exist
    index_path = f"faiss_indexes/{bot_name}"
    os.makedirs(index_path, exist_ok=True)
    
    # Save the FAISS index
    faiss.write_index(faiss_index.index, f"{index_path}/index")
    
    # Save the documents separately
    with open(f"{index_path}/docstore.pkl", "wb") as f:
        pickle.dump(faiss_index.docstore._dict, f)
    
    # Instead of storing the embedding function, we'll store its configuration
    index_data = {
        'index_directory': index_path,
        'embedding_type': 'OpenAIEmbeddings'  # Store the type of embedding we used
    }
    
    return index_data

def load_faiss_index(index_data):
    """Load FAISS index from stored data"""
    index_directory = index_data['index_directory']
    if not os.path.exists(index_directory):
        raise FileNotFoundError(f"Index directory {index_directory} does not exist.")
    
    # Recreate the embedding function
    embedding_function = OpenAIEmbeddings()
    
    # Load the FAISS index
    index = faiss.read_index(f"{index_directory}/index")
    
    # Load the documents
    with open(f"{index_directory}/docstore.pkl", "rb") as f:
        docstore = pickle.load(f)
    
    # Recreate the FAISS object
    faiss_index = FAISS(
        embedding_function=embedding_function,
        index=index,
        docstore=docstore
    )
    
    return faiss_index

@app.route("/", methods=["GET"])
def status():
    return jsonify({"message": "Chatbot is working 🤖"}), 200

@app.route("/create_chatbot", methods=["POST"])
# Update create_chatbot endpoint in app.py
def create_chatbot():
    """Endpoint to create a new chatbot."""
    data = request.json
    bot_name = data.get("bot_name")
    training_option = data.get("training_option")
    training_data = data.get("training_data")
 
    if not bot_name or not training_option or not training_data:
        return jsonify({"error": "Bot name, training option, and training data are required."}), 400
 
    try:
        processed_text = None
        # Process training data based on option
        if training_option == "Website URL":
            if not is_valid_url(training_data):
                return jsonify({"error": "Invalid URL provided"}), 400
            scraped_text, contact_info = scrape_data(training_data)
            processed_text = scraped_text
        elif training_option == "Document Upload":
            document_text = process_uploaded_file(training_data)
            processed_text = "\n\n".join(document_text) if isinstance(document_text, list) else document_text
        elif training_option == "Manual Input":
            processed_text = training_data
        else:
            return jsonify({"error": "Invalid training option."}), 400
 
        if not processed_text:
            return jsonify({"error": "No valid content could be processed"}), 400
 
        # Create document search index
        document_search = process_scraped_data(processed_text)
 
        # Save FAISS index and prepare data for MongoDB
        index_data = save_faiss_index(document_search, bot_name)
 
        # Save chatbot details in MongoDB
        chatbot = {
            "bot_name": bot_name,
            "training_option": training_option,
            "training_data": training_data,
            "index_data": index_data
        }
        result = chatbots_collection.insert_one(chatbot)
 
        return jsonify({
            "message": "Chatbot created successfully.", 
            "chatbot_id": str(result.inserted_id)
        }), 201
 
    except ValueError as ve:
        logging.error(f"Validation error: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logging.error(f"Error creating chatbot: {str(e)}")
        return jsonify({"error": "Failed to create chatbot"}), 500


def process_scraped_data(text):
    """Process text data and create FAISS index"""
    # Split text into smaller chunks if needed
    texts = [text]  # Add text splitting logic if required
    
    # Create embeddings
    embeddings = OpenAIEmbeddings()
    
    # Create and return FAISS index
    return FAISS.from_texts(texts, embeddings)

from langchain.chains import ConversationalRetrievalChain
from langchain_openai import ChatOpenAI
import logging

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    bot_id = data.get("bot_id")
    user_input = data.get("user_input")
    chat_history = data.get("chat_history", [])  # Default to empty list if not provided
 
    if not bot_id or not user_input:
        return jsonify({"error": "Bot ID and user input are required."}), 400
 
    try:
        bot_id = ObjectId(bot_id) if not isinstance(bot_id, ObjectId) else bot_id
        chatbot = chatbots_collection.find_one({"_id": bot_id})
        if not chatbot:
            return jsonify({"error": "Chatbot not found."}), 404
 
        index_data = chatbot.get("index_data")
        if not index_data:
            return jsonify({"error": "Index data is missing."}), 400
 
        document_search = load_faiss_index(index_data)
        retriever = document_search.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
 
        llm = ChatOpenAI(
            temperature=0.7,
            model_name="gpt-3.5-turbo"
        )
 
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            return_source_documents=True,
            max_tokens_limit=4000
        )
 
        # Include chat history in the chain input
        chain_input = {
            "question": user_input,
            "chat_history": chat_history
        }
 
        response = qa_chain(chain_input)
 
        # Extract and format response
        answer = response['answer']
        source_docs = response.get('source_documents', [])
        sources = [doc.page_content[:200] + "..." for doc in source_docs if hasattr(doc, 'page_content')]
 
        # Update chat history
        chat_history.append((user_input, answer))
 
        return jsonify({
            "bot_response": answer,
            "sources": sources if sources else None,
            "bot_name": chatbot["bot_name"],
            "chat_history": chat_history
        }), 200
 
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500
def save_faiss_index(faiss_index, bot_name):
    """Save FAISS index and its data for MongoDB storage"""
    # Create directory for FAISS indexes if it doesn't exist
    index_path = f"faiss_indexes/{bot_name}"
    os.makedirs(index_path, exist_ok=True)
    
    # Save the FAISS index
    faiss.write_index(faiss_index.index, f"{index_path}/index")
    
    # Save the docstore and index_to_docstore_id mapping
    with open(f"{index_path}/docstore.pkl", "wb") as f:
        pickle.dump({
            'docstore': faiss_index.docstore._dict,
            'index_to_docstore_id': faiss_index.index_to_docstore_id
        }, f)
    
    index_data = {
        'index_directory': index_path,
        'embedding_type': 'OpenAIEmbeddings'
    }
    
    return index_data

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

def process_scraped_data(text):
    """Process text data and create FAISS index"""
    try:
        # Split text into smaller chunks if needed
        from langchain.text_splitter import CharacterTextSplitter
        
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        texts = text_splitter.split_text(text)
        
        # Create embeddings
        embeddings = OpenAIEmbeddings()
        
        # Create and return FAISS index
        return FAISS.from_texts(texts, embeddings)
        
    except Exception as e:
        logging.error(f"Error processing text: {str(e)}")
        raise

if __name__ == "__main__":
    # Start the Flask app, accessible on all network interfaces at port 5000
    app.run(host="0.0.0.0", port=5001,debug=True)  

