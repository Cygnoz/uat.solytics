import os
import re
# import uuid
import tempfile
import streamlit as st
import requests
from dotenv import load_dotenv
import sounddevice as sd
from scipy.io.wavfile import write
from gtts import gTTS
import speech_recognition as sr

# Advanced library imports
import openai
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain

# File processing libraries
from PyPDF2 import PdfReader
from docx import Document
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class ChatbotApp:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize essential configurations
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is missing in the environment variables")
        
        openai.api_key = self.api_key
        
        # Initialize QA chain with updated OpenAI import
        self.chain = load_qa_chain(ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff")
        
        # Initialize session state
        if "chat_history" not in st.session_state:
            st.session_state["chat_history"] = []
        if "conversation_context" not in st.session_state:
            st.session_state["conversation_context"] = ""
        if "scraped_texts" not in st.session_state:
            st.session_state["scraped_texts"] = []
        if "document_search" not in st.session_state:
            st.session_state["document_search"] = None

    def process_pdf(self, file):
        """Extract text from uploaded PDF file."""
        reader = PdfReader(file)
        return [page.extract_text() for page in reader.pages]

    def process_docx(self, file):
        """Extract text from .docx file."""
        doc = Document(file)
        return [para.text for para in doc.paragraphs if para.text]

    def process_txt(self, file):
        """Extract text from .txt file."""
        return file.read().decode('utf-8').splitlines()

    def process_uploaded_file(self, file):
        """Determine file type and process accordingly."""
        file_extensions = {
            ".pdf": self.process_pdf,
            ".docx": self.process_docx,
            ".txt": self.process_txt
        }
        
        processor = file_extensions.get(os.path.splitext(file.name)[1])
        if processor:
            return processor(file)
        
        st.error("Unsupported file type. Please upload a .pdf, .docx, or .txt file.")
        return []

    def scrape_links(self, url):
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
            st.error(f"Error scraping links from {url}: {e}")
            return set()

    def extract_contact_info(self, text):
        """Advanced contact information extraction."""
        contact_patterns = {
            "emails": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "phone_numbers": r"\+?\(?\d{1,4}[\)\-\s]?\d{1,4}[\-\s]?\d{1,4}[\-\s]?\d{1,4}",
            "addresses": r"\d+\s[\w\s]+,?\s[\w\s]+,?\s[\w\s]+"
        }
        
        return {
            key: list(set(re.findall(pattern, text, re.MULTILINE)))
            for key, pattern in contact_patterns.items()
        }

    def scrape_data(self, url):
        """Comprehensive web scraping with contact info extraction."""
        raw_texts, contact_info = [], {}
        links = self.scrape_links(url)
        
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
                page_contact_info = self.extract_contact_info(page_text)
                
                # Merge contact info, avoiding duplicates
                for key, value in page_contact_info.items():
                    contact_info[key] = list(set(contact_info.get(key, []) + value))
                
            except requests.exceptions.RequestException:
                continue
        
        return raw_texts, contact_info

    def process_scraped_data(self, texts):
        """Process scraped text into searchable chunks."""
        text_splitter = CharacterTextSplitter(
            separator="\n", 
            chunk_size=800, 
            chunk_overlap=200, 
            length_function=len
        )
        
        texts = text_splitter.split_text("\n".join(texts))
        embeddings = OpenAIEmbeddings()
        
        return FAISS.from_texts(texts, embeddings)

    def get_response(self, user_input, bot_name):
        """Retrieve contextual response based on input."""
        if not st.session_state["document_search"]:
            return "Please provide training data via a website, document upload, or manual input."

        # Special handling for contact information queries
        contact_keywords = ["email", "phone", "contact", "address"]
        if any(keyword in user_input.lower() for keyword in contact_keywords):
            # Safely get contact_info, defaulting to an empty dictionary if None
            contact_info = st.session_state.get("contact_info", {}) or {}
            contact_type = next((kw for kw in contact_keywords if kw in user_input.lower()), None)
            
            if contact_type:
                # Use plural form of contact type for dictionary key
                results = contact_info.get(f"{contact_type}s", [])
                response = f"Here are the {contact_type}s I found: {', '.join(results)}" if results else f"No {contact_type}s found."
                return response

        # Regular document search
        docs = st.session_state["document_search"].similarity_search(user_input)
        
        if docs:
            kb_response = self.chain.run(input_documents=docs, question=user_input)
            kb_response = kb_response.replace("Based on the provided context, ", "").strip()
            kb_response = kb_response.replace("According to the information, ", "").strip()
            
            # Store the conversation
            st.session_state["chat_history"].append({"user": user_input, "bot": kb_response})
            
            # Update conversation context
            st.session_state["conversation_context"] += f"User: {user_input}\n{bot_name}: {kb_response}\n"
            
            return kb_response
        
        return "Ask questions related to the provided data. No external information is available."

    # def save_model_for_user(self, user_id):
    #     """Save the trained model for a specific user."""
    #     user_model_dir = os.path.join(self.USER_MODELS_DIR, user_id)
    #     os.makedirs(user_model_dir, exist_ok=True)
        
    #     # Instead of pickling the entire FAISS index, save and load separately
    #     if st.session_state["document_search"]:
    #         # Save index and texts separately
    #         index = st.session_state["document_search"].index
    #         texts = st.session_state["document_search"].index_to_docstore_id
            
    #         with open(os.path.join(user_model_dir, "faiss_index.pkl"), "wb") as f:
    #             pickle.dump(index, f)
            
    #         with open(os.path.join(user_model_dir, "faiss_texts.pkl"), "wb") as f:
    #             pickle.dump(texts, f)

    # def load_model_for_user(self, user_id):
    #     """Load the trained model for a specific user."""
    #     user_model_dir = os.path.join(self.USER_MODELS_DIR, user_id)
    #     try:
    #         # Load index and texts
    #         with open(os.path.join(user_model_dir, "faiss_index.pkl"), "rb") as f:
    #             index = pickle.load(f)
            
    #         with open(os.path.join(user_model_dir, "faiss_texts.pkl"), "rb") as f:
    #             texts = pickle.load(f)
            
    #         # Recreate the FAISS vector store
    #         embeddings = OpenAIEmbeddings()
    #         return FAISS.load_local(user_model_dir, embeddings, index=index, docstore=texts)
        
    #     except FileNotFoundError:
    #         return None

    def get_voice_input(self):
        """Capture voice input from the user."""
        duration = 5  # seconds
        fs = 16000  # Sample rate (16kHz)
        st.info("Listening... Speak now!")

        # Record audio from microphone
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()  # Wait until the recording is finished

        # Save the recorded audio to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        write(temp_file.name, fs, audio_data)

        # Use speech recognition to transcribe the audio
        try:
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

    def text_to_speech(self, response_text):
        """Convert text response to speech."""
        # Generate the speech audio
        tts = gTTS(text=response_text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_file = fp.name
            tts.save(temp_file)
        
        # Use Streamlit's audio player to play the generated audio
        st.audio(temp_file, format="audio/mp3")
        
        # Suggest cleaning up the file after ensuring it's no longer needed
        st.session_state["temp_audio_file"] = temp_file


    def generate_embed_codes(self, user_id):
        """Generate embed codes for the chatbot."""
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
        return iframe_code, chat_bubble_code

def main():
    # Initialize the ChatbotApp
    app = ChatbotApp()

    # Streamlit App Configuration
    st.set_page_config(page_title="Chitti Boy", layout="wide")
    st.title("🤖 Cygnoz Intelligence")

    # Sidebar for inputs
    with st.sidebar:
        st.header("Setup")
        
        # Bot name input
        bot_name = st.text_input("Enter the bot name", value="Chatbot")

        # Instructional text
        st.markdown("##### Choose how to train the bot: Website scraping, document upload, or manual input.")

        # Training options: Website, Document, or Manual Input
        training_option = st.radio("How do you want to train the bot?", 
                                    ("Website URL", "Document Upload", "Manual Input"))
        
        # Training logic based on selected option
        if training_option == "Website URL":
            website = st.text_input("Enter the website URL")
            if st.button("Scrape Website"):
                if website:
                    st.info(f"Scraping website: {website}")
                    scraped_texts, contact_info = app.scrape_data(website)
                    
                    if scraped_texts:
                        # Process scraped data
                        st.session_state["scraped_texts"] = scraped_texts
                        st.session_state["contact_info"] = contact_info
                        st.session_state["document_search"] = app.process_scraped_data(scraped_texts)
                        
                        st.success(f"Scraping completed! Start chatting with {bot_name}.")

        if training_option == "Document Upload":
            uploaded_file = st.file_uploader("Upload a document (.pdf, .docx, .txt)", type=["pdf", "docx", "txt"])
            
            if uploaded_file:
                if st.button("Process Document"):
                    try:
                        # Process the uploaded file
                        st.info("Processing document...")
                        file_texts = app.process_uploaded_file(uploaded_file)
                        
                        if file_texts:
                            # Treat the document text like website-scraped data
                            st.session_state["scraped_texts"] = file_texts
                            st.session_state["contact_info"] = None  # Placeholder, since no contact info is extracted
                            
                            # Process extracted texts into searchable format
                            st.session_state["document_search"] = app.process_scraped_data(file_texts)
                            
                            st.success(f"Document processed successfully! Start chatting with {bot_name}.")
                    
                    except Exception as e:
                        st.error(f"An error occurred while processing the document: {str(e)}")

        
        elif training_option == "Manual Input":
            manual_text = st.text_area("Enter your text data:")
            
            if st.button("Process Manual Input"):
                try:
                    if manual_text.strip():
                        # Treat the manual input like website-scraped data
                        manual_texts = manual_text.splitlines()  # Simulate splitting into multiple lines
                        st.session_state["scraped_texts"] = manual_texts
                        st.session_state["contact_info"] = None  # Placeholder, since no contact info is provided
                        
                        # Process manual input into searchable format
                        st.session_state["document_search"] = app.process_scraped_data(manual_texts)
                        st.success(f"Manual input processed! Start chatting with {bot_name}.")
                
                except Exception as e:
                    st.error(f"An error occurred while processing manual input: {str(e)}")


    # Chat interface
    st.subheader(f"Chat with {bot_name}")

    # Voice input option
    if st.button("Speak to the Bot"):
        user_input = app.get_voice_input()
        if user_input:
            bot_response = app.get_response(user_input, bot_name)
            st.markdown(f"**You:** {user_input}")
            st.markdown(f"**{bot_name}:** {bot_response}")
            
            # Optional speech playback
            if st.button("Play Response"):
                app.text_to_speech(bot_response)

    # Text input
    user_input = st.text_area("Enter your message:", height=100)
    if st.button("Send") and user_input.strip():
        bot_response = app.get_response(user_input, bot_name)
        st.markdown(f"**You:** {user_input}")
        st.markdown(f"**{bot_name}:** {bot_response}")
        
        # Optional speech playback
        if st.button("Play Response"):
            app.text_to_speech(bot_response)

    # Chat history
    st.subheader("Chat History")
    for chat in st.session_state.get("chat_history", []):
        st.markdown(f"- **You:** {chat['user']}")
        st.markdown(f"  **{bot_name}:** {chat['bot']}")


    if st.button("Start New Chat"):
        """Clear the chat history and reset the conversation context."""
    # Reset all session state variables related to the chat
        st.session_state["chat_history"] = []  # Clear chat history
        st.session_state["conversation_context"] = ""  # Reset conversation context
        st.session_state["scraped_texts"] = []  # Clear scraped texts
        st.session_state["document_search"] = None  # Clear document search object
        st.session_state["contact_info"] = None  # Clear contact info if any

        # Display a success message to indicate the chat has been reset
        st.success("Chat has been reset. You can start a new conversation!")


if __name__ == "__main__":
    main()