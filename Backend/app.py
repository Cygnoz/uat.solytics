import logging
import os
from flask_cors import CORS, cross_origin
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from pymongo import MongoClient
from gevent.pywsgi import WSGIServer
from werkzeug.security import generate_password_hash, check_password_hash
from framework import create_custom_framework, get_custom_framework, get_all_frameworks,delete_framework
from connection import get_database
 
# import pickle
# import openai
# import faiss
# from langchain_community.vectorstores.faiss import FAISS
# from langchain.embeddings.openai import OpenAIEmbeddings
# from bson import ObjectId
# from langchain.docstore.document import Document
# from langchain.docstore.in_memory import InMemoryDocstore
# from langchain.llms import OpenAI
# from langchain.text_splitter import CharacterTextSplitter
# from langchain.prompts import PromptTemplate
# from langchain.chains.question_answering import load_qa_chain

# # Import custom modules
# from file_processing import process_uploaded_file
# from data_processing import scrape_data, process_scraped_data
# from response_handling import ResponseHandler
# from embed_handling import ModelManager
# from voice_handler import VoiceHandler

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["*"], 
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

logging.basicConfig(level=logging.INFO)

# Configure MongoDB
db = get_database()
chatbots_collection = db["chatbots"]

# # Configure OpenAI
# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     raise ValueError("OPENAI_API_KEY is missing in the environment variables")
# openai.api_key = api_key

# Initialize helper classes
# response_handler = ResponseHandler()
# model_manager = ModelManager()
# voice_handler = VoiceHandler()


@app.route("/", methods=["GET"])
def status():
    return jsonify({"message": "Chatbot UAT is working 🤖"}), 200

# def process_scraped_data(text):
#     """Process text data and create FAISS index"""
#     try:
#         if not text or not isinstance(text, str):
#             raise ValueError("Invalid input: text must be a non-empty string")

#         # Split text into smaller chunks

        
#         text_splitter = CharacterTextSplitter(
#             separator="\n",
#             chunk_size=1000,
#             chunk_overlap=200,
#             length_function=len
#         )
        
#         texts = text_splitter.split_text(text)
        
#         if not texts:
#             raise ValueError("No text chunks were generated")

#         # Create embeddings
#         embeddings = OpenAIEmbeddings()
        
#         # Create FAISS index
#         faiss_index = FAISS.from_texts(texts, embeddings)
        
#         return faiss_index
        
#     except Exception as e:
#         logging.error(f"Error processing text: {str(e)}")
#         raise e


# @app.route("/create_chatbot", methods=["POST"])
# def create_chatbot():
#     """Endpoint to create a new chatbot."""
#     try:
#         # Add debugging to see what's actually in the request
#         logging.info(f"Request form: {request.form}")
#         logging.info(f"Request files: {request.files}")
#         if request.is_json:
#             logging.info(f"Request JSON: {request.json}")
        
#         if 'file' in request.files:
#             if request.content_type and "multipart/form-data" not in request.content_type:
#                 return jsonify({"error": "File upload option requires a multipart/form-data request with a file"}), 400
#             # Handle file upload case
#             file = request.files['file']
#             logging.info(f"File object type: {type(file)}")
#             logging.info(f"File object attributes: {dir(file)}")
            
#             if file.filename == '':
#                 return jsonify({"error": "No file selected"}), 400
                
#             bot_name = request.form.get('bot_name')
#             if not bot_name:
#                 return jsonify({"error": "Bot name is required"}), 400
                
#             training_data = file
#             training_option = "file"  # Set the training option automatically for file uploads
#             # Store filename for database
#             training_data_to_store = file.filename
            
#         else:
#             # Handle JSON data case
#             if not request.is_json:
#                 return jsonify({"error": "Expected JSON data or file upload"}), 415
                
#             data = request.json
#             bot_name = data.get("bot_name")
#             training_option = data.get("training_option")
#             training_data = data.get("training_data")
    
#             if not bot_name or not training_option or not training_data:
#                 return jsonify({"error": "Bot name, training option, and training data are required."}), 400
                
#             # Initialize training_data_to_store based on training option
#             if training_option == "website":
#                 training_data_to_store = training_data  # Store the URL
#             elif training_option == "text":
#                 # Store a summary or identifier for text data
#                 training_data_to_store = f"Text input ({len(training_data)} characters)"
#             elif training_option == "file":
#                 # For file option from JSON, we need to reject this case as we can't handle
#                 # file paths sent as strings - we need actual file objects
#                 return jsonify({"error": "File upload option requires a multipart/form-data request with a file"}), 400
#             else:
#                 training_data_to_store = str(training_data)
    
#         try:
#             processed_text = None
#             # Process training data based on option
#             if training_option == "website":
#                 # Verify URL is provided
#                 if not training_data:
#                     return jsonify({"error": "Website URL is required"}), 400
                    
#                 # Try to scrape website data
#                 try:
#                     scraped_text, contact_info = scrape_data(training_data)
#                     processed_text = scraped_text
#                     # Log successful scraping
#                     logging.info(f"Successfully scraped website: {training_data}")
#                 except ValueError as e:
#                     logging.error(f"Website scraping error: {str(e)}")
#                     return jsonify({"error": f"Website scraping failed: {str(e)}"}), 400
                    
#             elif training_option == "file":
#                 # For file option, we now know we have a file object because we rejected 
#                 # the case where training_option is "file" but the data came from JSON
#                 try:
#                     # Log file info before processing
#                     logging.info(f"Processing file: {training_data.filename}")
#                     # Get file extension
#                     _, file_ext = os.path.splitext(training_data.filename)
#                     file_ext = file_ext.lower()

#                     document_text = process_uploaded_file(training_data)                    
#                     if not document_text:
#                         return jsonify({"error": "Failed to process document content"}), 400
                    
#                     processed_text = "\n\n".join(document_text) if isinstance(document_text, list) else document_text
                    
#                     # Log success
#                     logging.info(f"Successfully processed file: {training_data.filename}")
#                 except Exception as e:
#                     logging.error(f"File processing error: {str(e)}")
#                     return jsonify({"error": f"Failed to process file: {str(e)}"}), 400
                
#             elif training_option == "text":
#                 # For text option, use directly
#                 processed_text = training_data
#             else:
#                 return jsonify({"error": "Invalid training option."}), 400
    
#             # Validate processed text
#             if not processed_text or not isinstance(processed_text, str) or not processed_text.strip():
#                 return jsonify({"error": "No valid content could be processed"}), 400
    
#             # Create document search index
#             try:
#                 document_search = process_scraped_data(processed_text)
#             except ValueError as ve:
#                 logging.error(f"Error creating search index: {str(ve)}")
#                 return jsonify({"error": f"Failed to process content: {str(ve)}"}), 400
    
#             # Save FAISS index and prepare data for MongoDB
#             index_data = save_faiss_index(document_search, bot_name)
    
#             # Save chatbot details in MongoDB - use training_data_to_store instead of training_data
#             chatbot = {
#                 "bot_name": bot_name,
#                 "training_option": training_option,
#                 "training_data": training_data_to_store,  # Use the stored representation
#                 "index_data": index_data
#             }
#             result = chatbots_collection.insert_one(chatbot)
    
#             return jsonify({
#                 "message": "Chatbot created successfully.", 
#                 "chatbot_id": str(result.inserted_id)
#             }), 201
    
#         except ValueError as ve:
#             logging.error(f"Validation error: {str(ve)}")
#             return jsonify({"error": str(ve)}), 400
#         except Exception as e:
#             logging.error(f"Error creating chatbot: {str(e)}")
#             return jsonify({"error": f"Failed to create chatbot: {str(e)}"}), 500
#     except Exception as e:
#         logging.error(f"Error creating chatbot: {str(e)}")
#         return jsonify({"error": f"Failed to create chatbot: {str(e)}"}), 500    


# @app.route("/chat", methods=["POST"])
# def chat():
#     """Endpoint to handle chat interactions."""
#     try:
#         logging.info("Processing chat request...")
        
#         if not request.is_json:
#             return jsonify({
#                 "error": "Content-Type must be application/json"
#             }), 415

#         data = request.get_json()
        
#         if not data.get("message") or not data.get("bot_name"):
#             return jsonify({
#                 "error": "Missing required fields",
#                 "required": ["message", "bot_name"]
#             }), 400

#         bot_name = data["bot_name"]
#         message = data["message"]
#         conversation_history = data.get("conversation_history", [])

#         # Check if bot exists
#         bot = chatbots_collection.find_one({"bot_name": bot_name})
#         if not bot:
#             return jsonify({
#                 "error": "Bot not found",
#                 "message": f"No bot found with name: {bot_name}"
#             }), 404

#         # Get the index path from MongoDB data
#         index_path = bot.get("index_data", {}).get("index_directory")
#         if not index_path:
#             return jsonify({
#                 "error": "Invalid bot data",
#                 "message": "Bot index data not found"
#             }), 500

#         if not os.path.exists(index_path):
#             logging.error(f"Index not found at {index_path}")
#             return jsonify({
#                 "error": "Bot data not found",
#                 "message": f"No training data found for bot: {bot_name}",
#                 "expected_path": index_path
#             }), 404

#         try:
#             # Load the saved index
#             logging.info(f"Loading FAISS index from: {index_path}")
#             embeddings = OpenAIEmbeddings()
            
#             # Add proper error handling for folder path
#             if not os.path.isdir(index_path):
#                 os.makedirs(index_path, exist_ok=True)
#                 logging.warning(f"Created missing directory: {index_path}")

#             # Use the correct method to load FAISS index
#             document_search = FAISS.load_local(
#                 index_path,  # Pass the path directly
#                 embeddings=embeddings,
#                 allow_dangerous_deserialization=True
#             )    

#             # Search for similar content
#             logging.info("Searching for relevant content...")
#             docs = document_search.similarity_search(message, k=4)  
            
#             # Fix for the second issue: enhance response generation
#             if docs:
#                 # Use a QA chain to generate an answer based on retrieved documents
#                 llm = OpenAI(temperature=0.2)  # Slightly increased temperature for more natural responses
                
#                 # Create a template with instructions to use context properly
#                 template = """
#                 Use the following pieces of context to answer the question at the end. 
#                 If you don't know the answer, just say that you don't know, don't try to make up an answer.
                
#                 Context:
#                 {context}
                
#                 Question: {question}
                
#                 Answer:
#                 """
                
#                 # Create a prompt from the template
#                 prompt = PromptTemplate(
#                     input_variables=["context", "question"],
#                     template=template
#                 )
                
#                 # Use a chain that properly uses the context
#                 qa_chain = load_qa_chain(
#                     llm, 
#                     chain_type="stuff",
#                     prompt=prompt
#                 )
                
#                 # Format the context from retrieved documents
#                 context = "\n\n".join([doc.page_content for doc in docs])
                
#                 # Run the chain
#                 response = qa_chain.run(
#                     input_documents=docs, 
#                     question=message
#                 )
                
#                 logging.info("Generated response based on relevant content")
#             else:
#                 response = "I couldn't find relevant information to answer your question. Could you try rephrasing or asking something related to the content I was trained on?"
#                 logging.info("No relevant content found")
                
#             return jsonify({
#                 "response": response
#             }), 200

#         except Exception as e:
#             logging.error(f"Chat error: {str(e)}")
#             return jsonify({
#                 "error": "Failed to process chat",
#                 "message": str(e)
#             }), 500

#     except Exception as e:
#         logging.error(f"Chat error: {str(e)}")
#         return jsonify({
#             "error": "Internal server error",
#             "message": str(e)
#         }), 500
    
# def save_faiss_index(faiss_index, bot_name):
#     """Save FAISS index and its data"""
#     try:
#         # Create directory
#         index_path = os.path.join('faiss_indexes', bot_name)
#         os.makedirs(index_path, exist_ok=True)
#         logging.info(f"Created directory: {index_path}")

#         # Save the index and docstore
#         faiss_index.save_local(index_path)
        
#         # Log what files were created
#         files = os.listdir(index_path)
#         logging.info(f"Files created in {index_path}: {files}")

#         return {
#             'index_directory': index_path,
#             'embedding_type': 'OpenAIEmbeddings'
#         }
#     except Exception as e:
#         logging.error(f"Error saving FAISS index: {str(e)}")
#         raise e

# def load_faiss_index(index_data):
#     """Load FAISS index from stored data"""
    
#     index_directory = index_data['index_directory']
    
#     # Recreate the embedding function
#     embedding_function = OpenAIEmbeddings()
    
#     # Load the FAISS index
#     index = faiss.read_index(f"{index_directory}/index")
    
#     # Load the docstore and mapping
#     with open(f"{index_directory}/docstore.pkl", "rb") as f:
#         stored_data = pickle.load(f)
#         docstore_dict = stored_data['docstore']
#         index_to_docstore_id = stored_data['index_to_docstore_id']
    
#     # Convert the docstore dict to Document objects if needed
#     docstore = InMemoryDocstore({})
#     for k, v in docstore_dict.items():
#         if not isinstance(v, Document):
#             docstore._dict[k] = Document(page_content=v)
#         else:
#             docstore._dict[k] = v
    
#     # Recreate the FAISS object with all required parameters
#     faiss_index = FAISS(
#         embedding_function=embedding_function,
#         index=index,
#         docstore=docstore,
#         index_to_docstore_id=index_to_docstore_id
#     )
    
#     return faiss_index



@app.route('/create_framework', methods=['POST'])
@cross_origin()
def create_framework():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        result = create_custom_framework(data)
        return jsonify({"message": "Framework created successfully", "id": result}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/get_framework/<project_name>", methods=["GET"])
def get_framework(project_name):
    try:
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

@app.route('/get_all_frameworks', methods=['GET'])
def frameworks_endpoint():
    try:
        frameworks = get_all_frameworks()
        return jsonify({"frameworks": frameworks})
    except ValueError as e:
        return jsonify({"error": "Failed to retrieve frameworks", "message": str(e)}), 400


@app.route("/delete_framework/<framework_id>", methods=["DELETE"])
def delete_framework_endpoint(framework_id):
    try:
        result = delete_framework(framework_id)
        if result["success"]:
            return jsonify(result), 200
        return jsonify(result), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    try:
        port = int(os.getenv("PORT", 5001))
        print(f"Starting production server on port {port}")
        logger.info(f"Starting production server on port {port}")
        
        # Use gevent WSGI server instead of Flask development server
        http_server = WSGIServer(('0.0.0.0', port), app)
        logger.info(f"Serving on http://0.0.0.0:{port}")
        http_server.serve_forever()
        
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise

