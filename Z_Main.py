# Import necessary libraries
import openai
import streamlit as st
from langchain_community.embeddings.openai import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_community.llms import OpenAI
from PyPDF2 import PdfReader
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests
import os
from dotenv import load_dotenv
from docx import Document
import uuid
import pickle
import shutil
import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
from playsound import playsound
from gtts import gTTS
import tempfile
import re
import faiss

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is missing in the environment variables.")
openai.api_key = api_key

# Initialize session state variables
if "chat_history" not in st.session_state:
    st.session_state["chat_history"] = []
if "conversation_context" not in st.session_state:
    st.session_state["conversation_context"] = ""
if "document_search" not in st.session_state:
    st.session_state["document_search"] = None
if "scraped_texts" not in st.session_state:
    st.session_state["scraped_texts"] = []



# Functions for web scraping
def scrape_links(url):
    """Fetch all unique links from the provided URL."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        links = set()
        for anchor in soup.find_all("a", href=True):
            full_url = urljoin(url, anchor["href"])
            if full_url.startswith('mailto:') or full_url.startswith('tel:'):
                continue
            links.add(full_url)
        return links
    except requests.exceptions.RequestException as e:
        st.error(f"Error scraping links from {url}: {e}")
        return set()

def scrape_data(url):
    """Scrape text content from the list of URLs."""
    raw_text = ''
    links = scrape_links(url)
    for link in links:
        try:
            response = requests.get(link)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            for paragraph in soup.find_all(['p', 'h1', 'h2', 'h3']):
                raw_text += paragraph.get_text() + "\n"
        except requests.exceptions.RequestException:
            pass  # Silently ignore errors for individual links
    return raw_text.splitlines()

# Function to extract contact information from text
def extract_contact_info(text):
    contact_info = {
        "emails": [],
        "phone_numbers": [],
        "addresses": []
    }

    # Regular expression for matching emails
    email_regex = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    contact_info["emails"] = re.findall(email_regex, text)

    # Regular expression for matching phone numbers (basic pattern)
    phone_regex = r"\+?\(?\d{1,4}[\)\-\s]?\d{1,4}[\-\s]?\d{1,4}[\-\s]?\d{1,4}"
    contact_info["phone_numbers"] = re.findall(phone_regex, text)

    # Regular expression for matching addresses (basic example)
    address_regex = r"\d+\s[\w\s]+,?\s[\w\s]+,?\s[\w\s]+"
    contact_info["addresses"] = re.findall(address_regex, text)

    return contact_info

# Function to scrape website data and extract contact info
def scrape_data(url):
    """Scrape text content from the list of URLs."""
    raw_text = ''
    contact_info = {"emails": [], "phone_numbers": [], "addresses": []}
    links = scrape_links(url)
    
    for link in links:
        try:
            response = requests.get(link)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            for paragraph in soup.find_all(['p', 'h1', 'h2', 'h3']):
                raw_text += paragraph.get_text() + "\n"
                
            # Extract contact information from the raw text
            extracted_info = extract_contact_info(raw_text)
            contact_info["emails"].extend(extracted_info["emails"])
            contact_info["phone_numbers"].extend(extracted_info["phone_numbers"])
            contact_info["addresses"].extend(extracted_info["addresses"])

        except requests.exceptions.RequestException:
            pass  # Silently ignore errors for individual links
    
    return raw_text.splitlines(), contact_info

def process_scraped_data(scraped_texts):
    """Process scraped text into searchable chunks."""
    text_splitter = CharacterTextSplitter(separator="\n", chunk_size=1500, chunk_overlap=50, length_function=len)
    texts = text_splitter.split_text("\n".join(scraped_texts))
    embeddings = OpenAIEmbeddings()
    return FAISS.from_texts(texts, embeddings)

# Initialize OpenAI QA chain
chain = load_qa_chain(OpenAI(), chain_type="stuff")

# Get chatbot response and handle input/output
def get_response(user_input):
    global bot_name
    bot_response = ""

    if not st.session_state["document_search"]:
        return "Please provide training data via a website, document upload, or manual input."

    question = user_input.strip()
    
    # Check if the question asks for contact info
    if any(keyword in question.lower() for keyword in ["email", "phone", "contact", "address"]):
        contact_info = st.session_state.get("contact_info", {})
        if "email" in question.lower():
            bot_response = "Here are the emails I found: " + ", ".join(contact_info.get("emails", [])) if contact_info.get("emails") else "No emails found."
        elif "phone" in question.lower():
            bot_response = "Here are the phone numbers I found: " + ", ".join(contact_info.get("phone_numbers", [])) if contact_info.get("phone_numbers") else "No phone numbers found."
        elif "address" in question.lower():
            bot_response = "Here are the addresses I found: " + ", ".join(contact_info.get("addresses", [])) if contact_info.get("addresses") else "No addresses found."
        else:
            bot_response = "I couldn't find specific contact information."
    else:
        # Continue as before, use similarity search to find answers based on the document search
        docs = st.session_state["document_search"].similarity_search(user_input)
        if docs:
            kb_response = chain.run(input_documents=docs, question=question)
            kb_response = kb_response.replace("Based on the provided context, ", "").strip()
            kb_response = kb_response.replace("According to the information, ", "").strip()
            bot_response = kb_response
        else:
            bot_response = "Ask questions related to the provided data. No external information is available."

    # Store the conversation
    st.session_state["chat_history"].append({"user": user_input, "bot": bot_response})

    # Update conversation context for follow-up questions
    st.session_state["conversation_context"] += f"User: {user_input}\n{bot_name}: {bot_response}\n"

    return bot_response# Get response function

# def get_response(user_input):
#     global bot_name
#     bot_response = ""

#     if not st.session_state["document_search"]:
#         return "Please provide training data via a website, document upload, or manual input."

#     question = user_input.strip()

#     # Check if the question asks for contact info
#     if any(keyword in question.lower() for keyword in ["email", "phone", "contact", "address"]):
#         contact_info = st.session_state.get("contact_info", {"emails": [], "phone_numbers": [], "addresses": []})
#         if "email" in question.lower():
#             bot_response = "Here are the emails I found: " + ", ".join(contact_info.get("emails", [])) if contact_info.get("emails") else "No emails found."
#         elif "phone" in question.lower():
#             bot_response = "Here are the phone numbers I found: " + ", ".join(contact_info.get("phone_numbers", [])) if contact_info.get("phone_numbers") else "No phone numbers found."
#         elif "address" in question.lower():
#             bot_response = "Here are the addresses I found: " + ", ".join(contact_info.get("addresses", [])) if contact_info.get("addresses") else "No addresses found."
#         else:
#             bot_response = "I couldn't find specific contact information."
#     else:
#         # Continue as before, use similarity search to find answers based on the document search
#         docs = st.session_state["document_search"].similarity_search(user_input)
#         if docs:
#             kb_response = chain.run(input_documents=docs, question=question)
#             kb_response = kb_response.replace("Based on the provided context, ", "").strip()
#             kb_response = kb_response.replace("According to the information, ", "").strip()
#             bot_response = kb_response
#         else:
#             bot_response = "Ask questions related to the provided data. No external information is available."

    # # Store the conversation
    # st.session_state["chat_history"].append({"user": user_input, "bot": bot_response})

    # # Update conversation context for follow-up questions
    # st.session_state["conversation_context"] += f"User: {user_input}\n{bot_name}: {bot_response}\n"

    # return bot_response

# Speech-to-Text Function using sounddevice
def get_voice_input():
    duration = 5  # seconds
    fs = 16000  # Sample rate (16kHz)
    st.info("Listening... Speak now!")

    # Record audio from microphone
    audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait until the recording is finished

    # Save the recorded audio to a temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    write(temp_file.name, fs, audio_data)

    # Use a speech-to-text library to transcribe the audio
    try:
        import speech_recognition as sr
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_file.name) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            st.success(f"Recognized voice input: {text}")
            os.remove(temp_file.name)  # Clean up temporary file
            return text
    except Exception as e:
        st.error(f"Error recognizing speech: {str(e)}")
        os.remove(temp_file.name)  # Clean up temporary file
    return ""

def text_to_speech(response_text):
    # Generate the speech audio
    tts = gTTS(text=response_text, lang='en')
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
        temp_file = fp.name
        tts.save(temp_file)
    
    # Use Streamlit's audio player to play the generated audio
    st.audio(temp_file, format="audio/mp3")

    # Clean up the temporary file after use
    os.remove(temp_file)

def save_and_generate_embed_code():
    user_id = str(uuid.uuid4())  # Unique ID for this user
    iframe_code = f'<iframe src="https://yourdomain.com/chat/{user_id}" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>'
    chat_bubble_code = f"""
    <script>
    window.embeddedChatbotConfig = {{
        chatbotId: "{user_id}",
        domain: "yourdomain.com"
    }}
    </script>
    <script
    src="https://yourdomain.com/embed.min.js"
    chatbotId="{user_id}"
    domain="yourdomain.com"
    defer>
    </script>
    """
    return user_id, iframe_code, chat_bubble_code

def save_faiss_model(faiss_model, file_path):
    # Extract only the necessary part of the FAISS model (e.g., embeddings or vectors)
    # Assuming the FAISS object has some attributes that can be serialized.
    serializable_data = faiss_model.get_serializable_data()
    with open(file_path, "wb") as f:
        pickle.dump(serializable_data, f)

# Save the model and generate a shareable link with embed codes
def save_and_generate_link():
    user_id = str(uuid.uuid4())  # Unique ID for this user
    document_search = st.session_state["document_search"]  # The trained model
    
    # Save the trained model to disk
    save_model_for_user(user_id, document_search)
    
    # Generate the shareable link for this user
    shareable_link = generate_unique_link()
    
    # Return both the shareable link and the chatbot iframe/chat bubble ID
    return user_id, shareable_link


# USER_MODELS_DIR = "user_models"

# # Ensure the user models directory exists
# os.makedirs(USER_MODELS_DIR, exist_ok=True)

# def save_model_for_user(user_id, document_search):
#     try:
#         # Assuming document_search is a FAISS object, extract serializable parts
#         serializable_data = document_search.get_serializable_data()  # Define this method to exclude non-serializable parts
#         with open(f"{user_id}_model.pkl", "wb") as f:
#             pickle.dump(serializable_data, f)
#     except Exception as e:
#         print(f"Error during model serialization: {e}")

# def load_model_for_user(user_id):
#     """Load the trained model (FAISS index) for the user."""
#     user_model_dir = os.path.join(USER_MODELS_DIR, user_id)
#     try:
#         with open(os.path.join(user_model_dir, "document_search.pkl"), "rb") as f:
#             document_search = pickle.load(f)
#         return document_search
#     except FileNotFoundError:
#         return None

def generate_unique_link():
    """Generate a unique link for each user."""
    user_id = str(uuid.uuid4())  # Generate a unique ID for the user
    return f"/chat/{user_id}"  # You can append this to your app's URL

def save_and_generate_link():
    user_id = str(uuid.uuid4())  # Unique ID for this user
    document_search = st.session_state["document_search"]  # The trained model
    
    # Save the trained model to disk
    save_model_for_user(user_id, document_search)
    
    # Generate the shareable link for this user
    shareable_link = generate_unique_link()
    
    return user_id, shareable_link

def load_shared_model(user_id):
    """Load the model based on the unique user ID from the link."""
    document_search = load_model_for_user(user_id)
    if document_search:
        st.session_state["document_search"] = document_search
        return True
    else:
        return False

# Streamlit App
st.set_page_config(page_title="Chitti Boy", layout="wide")
st.title("🤖 Cygnoz Intelligence")

# Sidebar for inputs
with st.sidebar:
    st.header("Setup")
    
    # Bot name input
    bot_name = st.text_input("Enter the bot name", value="Chatbot")

    # Instructional text
    st.markdown("##### Choose how to train the bot:Website scraping, document upload, or manual input.")

    # Training options: Website, Document, or Manual Input
    training_option = st.radio("How do you want to train the bot?", 
                                ("Website URL", "Document Upload", "Manual Input"))

    if training_option == "Website URL":
        website = st.text_input("Enter the website URL")
        if st.button("Scrape Website"):
            if website:
                st.info(f"Scraping website: {website}")
                scraped_texts, contact_info = scrape_data(website)
                st.session_state["scraped_texts"] = scraped_texts
                st.session_state["contact_info"] = contact_info  # Store contact info
                if scraped_texts:
                    st.session_state["document_search"] = process_scraped_data(scraped_texts)
                    st.success(f"Scraping completed! Start chatting with {bot_name}.")
                
                    # Generate and show iframe/chatbot code
                    user_id, shareable_link = save_and_generate_link()
                    st.success(f"Your shareable link is: {shareable_link}")
                    st.subheader("Embed Your Chatbot")
                    iframe_code = f'<iframe src="https://yourdomain.com/chat/{user_id}" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>'
                    hat_bubble_script = f"""
                        <script>
                        window.embeddedChatbotConfig = {{
                        chatbotId: "{user_id}",
                        domain: "yourdomain.com"
                        }}
                        </script>
                        <script
                        src="https://yourdomain.com/embed.min.js"
                        chatbotId="{user_id}"
                        domain="yourdomain.com"
                        defer>
                        </script>
                    """
                    st.markdown("### Embed the Chatbot on Your Website:")
                    st.code(iframe_code, language="html")
                    st.markdown("### Chat Bubble Script:")
                    st.code(hat_bubble_script, language="html")
                else:
                    st.error("No text found on the website. Please try another URL.")
            else:
                st.error("Please enter a valid website URL.")

    elif training_option == "Document Upload":
        uploaded_file = st.file_uploader("Upload a document (.pdf, .docx, .txt)", type=["pdf", "docx", "txt"])
        if uploaded_file and st.button("Process Document"):
            st.info("Processing document...")
            file_texts = process_uploaded_file(uploaded_file)
            st.session_state["scraped_texts"] = file_texts
            if file_texts:
                st.session_state["document_search"] = process_scraped_data(file_texts)
                st.success(f"Document processed successfully! Start chatting with {bot_name}.")
                
                # Generate and show iframe/chatbot code
                user_id, shareable_link = save_and_generate_link()
                st.success(f"Your shareable link is: {shareable_link}")
                st.subheader("Embed Your Chatbot")
                iframe_code = f'<iframe src="https://yourdomain.com/chat/{user_id}" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>'
                chat_bubble_script = f"""
                    <script>
                    window.embeddedChatbotConfig = {{
                    chatbotId: "{user_id}",
                    domain: "yourdomain.com"
                    }}
                    </script>
                    <script
                    src="https://yourdomain.com/embed.min.js"
                    chatbotId="{user_id}"
                    domain="yourdomain.com"
                    defer>
                    </script>
                """
                st.markdown("### Embed the Chatbot on Your Website:")
                st.code(iframe_code, language="html")
                st.markdown("### Chat Bubble Script:")
                st.code(chat_bubble_script, language="html")
            else:
                st.error("Could not extract text from the document. Please try another file.")
                
    elif training_option == "Manual Input":
        manual_text = st.text_area("Enter your text data:")
        if st.button("Process Manual Input"):
            if manual_text.strip():
                manual_texts = manual_text.splitlines()
                st.session_state["scraped_texts"] = manual_texts
                st.session_state["document_search"] = process_scraped_data(manual_texts)
                st.success(f"Manual input processed! Start chatting with {bot_name}.")
                
                # Generate and show iframe/chatbot code
                user_id, shareable_link = save_and_generate_link()
                st.success(f"Your shareable link is: {shareable_link}")
                st.subheader("Embed Your Chatbot")
                iframe_code = f'<iframe src="https://yourdomain.com/chat/{user_id}" width="100%" style="height: 100%; min-height: 700px" frameborder="0"></iframe>'
                chat_bubble_script = f"""
                    <script>
                    window.embeddedChatbotConfig = {{
                    chatbotId: "{user_id}",
                    domain: "yourdomain.com"
                    }}
                    </script>
                    <script
                    src="https://yourdomain.com/embed.min.js"
                    chatbotId="{user_id}"
                    domain="yourdomain.com"
                    defer>
                    </script>
                """
                st.markdown("### Embed the Chatbot on Your Website:")
                st.code(iframe_code, language="html")
                st.markdown("### Chat Bubble Script:")
                st.code(chat_bubble_script, language="html")
            else:
                st.error("Please enter valid text data.")

# Ensure unique key names for widgets
if "user_input" not in st.session_state:
    st.session_state["user_input"] = ""
st.subheader(f"Chat with {bot_name}")
# Voice input option
if st.button("Speak to the Bot"):
    user_input = get_voice_input()
    if user_input:
        st.session_state["user_input"] = user_input
        bot_response = get_response(user_input)
        st.markdown(f"**You:** {st.session_state['user_input']}")
        st.markdown(f"**{bot_name}:** {bot_response}")
        # Play bot response
        if st.button("Play Response"):
            text_to_speech(bot_response)

# Text input box
user_input = st.text_area("Enter your message:", key="user_input", height=100)
# Send button logic
if st.button("Send") or (user_input and st.session_state["user_input"]):  # Handle Enter key trigger
    if user_input.strip():
        bot_response = get_response(user_input)
        st.markdown(f"**You:** {user_input}")
        st.markdown(f"**{bot_name}:** {bot_response}")
        # Play bot response
        if st.button("Play Response"):
            text_to_speech(bot_response)
        # Clear the input box after sending
        # st.session_state["user_input"] = ""
    else:
        st.error("Please enter a message before sending.")


# Display Chat History
st.subheader("Chat History")
for chat in st.session_state["chat_history"]:
    st.markdown(f"- **You:** {chat['user']}")
    st.markdown(f"  **{bot_name}:** {chat['bot']}")

# New Chat Option to Clear History and Start New Topic
if st.button("Start New Chat"):
    st.session_state["chat_history"] = []
    st.session_state["conversation_context"] = ""
    st.session_state["scraped_texts"] = []
    st.session_state["document_search"] = None
    st.success("Chat reset. You can start a new conversation!")

# Directory to store the models for different users
USER_MODELS_DIR = "user_models"

# Ensure the user models directory exists
os.makedirs(USER_MODELS_DIR, exist_ok=True)

def save_model_for_user(user_id, document_search):
    """Save the trained model (FAISS index) for the user."""
    user_model_dir = os.path.join(USER_MODELS_DIR, user_id)
    os.makedirs(user_model_dir, exist_ok=True)
    
    # Save the document search model (FAISS index) as a file
    with open(os.path.join(user_model_dir, "document_search.pkl"), "wb") as f:
        pickle.dump(document_search, f)

def load_model_for_user(user_id):
    """Load the trained model (FAISS index) for the user."""
    user_model_dir = os.path.join(USER_MODELS_DIR, user_id)
    try:
        with open(os.path.join(user_model_dir, "document_search.pkl"), "rb") as f:
            document_search = pickle.load(f)
        return document_search
    except FileNotFoundError:
        return None

def generate_unique_link():
    """Generate a unique link for each user."""
    user_id = str(uuid.uuid4())  # Generate a unique ID for the user
    return f"/chat/{user_id}"  # You can append this to your app's URL

# Save the model and generate a link when training is complete
def save_and_generate_link():
    user_id = str(uuid.uuid4())  # Unique ID for this user
    document_search = st.session_state["document_search"]  # The trained model
    
    # Save the trained model to disk
    save_model_for_user(user_id, document_search)
    
    # Generate the shareable link for this user
    shareable_link = generate_unique_link()
    
    return shareable_link

# Load the model for shared links
def load_shared_model(user_id):
    """Load the model based on the unique user ID from the link."""
    document_search = load_model_for_user(user_id)
    if document_search:
        st.session_state["document_search"] = document_search
        return True
    else:
        return False

# In the Streamlit app, where user chooses how to train:
if training_option == "Document Upload" and uploaded_file:
    # After processing the document, save the model and generate a unique link
    if st.button("Generate Shareable Link"):
        shareable_link = save_and_generate_link()
        st.success(f"Your shareable link is: {shareable_link}")


# Display embed codes after model creation
if training_option == "Document Upload" and uploaded_file:
    if st.button("Generate Embed Codes"):
        user_id, iframe_code, chat_bubble_code = save_and_generate_embed_code()
        st.success(f"Model created successfully with ID: {user_id}")
        st.markdown("### Embed Chatbot on Your Website")
        
        # Display iFrame embed code
        st.subheader("iFrame Code")
        st.code(iframe_code, language="html")
        
        # Display chat bubble embed code
        st.subheader("Chat Bubble Code")
        st.code(chat_bubble_code, language="html")
        
        # Optionally, allow downloading a text file with the embed codes
        embed_codes = f"iFrame Code:\n{iframe_code}\n\nChat Bubble Code:\n{chat_bubble_code}"
        st.download_button("Download Embed Codes", data=embed_codes, file_name=f"chatbot_{user_id}_embed_codes.txt")

# Load the model for shared links
if "/chat/" in st.query_params:
    user_id = st.query_params.get("chat_id", [None])[0]
    if user_id:
        if load_shared_model(user_id):
            st.success("Model loaded successfully! You can now chat.")
        else:
            st.error("Could not load the model. Please ensure the link is correct.")
    else:
        st.error("No user ID found in the URL.")
