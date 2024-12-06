import os
import streamlit as st
from dotenv import load_dotenv
import openai

# Import custom modules
from file_processing import process_uploaded_file
from data_processing import scrape_data, process_scraped_data
from response_handling import ResponseHandler
from embed_handling import ModelManager
from voice_and_audio import VoiceHandler

class ChatbotApp:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize essential configurations
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is missing in the environment variables")
        
        openai.api_key = self.api_key
        
        # Initialize helper classes
        self.response_handler = ResponseHandler()
        self.model_manager = ModelManager()
        self.voice_handler = VoiceHandler()
        
        # Initialize session state
        self._init_session_state()

    def _init_session_state(self):
        """Initialize session state variables."""
        default_states = {
            "chat_history": [],
            "conversation_context": "",
            "scraped_texts": [],
            "document_search": None,
            "contact_info": None
        }
        
        for key, default_value in default_states.items():
            if key not in st.session_state:
                st.session_state[key] = default_value

    def main(self):
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
                        scraped_texts, contact_info = scrape_data(website)
                        
                        if scraped_texts:
                            # Process scraped data
                            st.session_state["scraped_texts"] = scraped_texts
                            st.session_state["contact_info"] = contact_info
                            st.session_state["document_search"] = process_scraped_data(scraped_texts)
                            
                            st.success(f"Scraping completed! Start chatting with {bot_name}.")

            if training_option == "Document Upload":
                uploaded_file = st.file_uploader("Upload a document (.pdf, .docx, .txt)", type=["pdf", "docx", "txt"])
                
                if uploaded_file:
                    if st.button("Process Document"):
                        try:
                            # Process the uploaded file
                            st.info("Processing document...")
                            file_texts = process_uploaded_file(uploaded_file)
                            
                            if file_texts:
                                # Treat the document text like website-scraped data
                                st.session_state["scraped_texts"] = file_texts
                                st.session_state["contact_info"] = None  # Placeholder, since no contact info is extracted
                                
                                # Process extracted texts into searchable format
                                st.session_state["document_search"] = process_scraped_data(file_texts)
                                
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
                            st.session_state["document_search"] = process_scraped_data(manual_texts)
                            st.success(f"Manual input processed! Start chatting with {bot_name}.")
                    
                    except Exception as e:
                        st.error(f"An error occurred while processing manual input: {str(e)}")

        # Chat interface
        st.subheader(f"Chat with {bot_name}")

        # Voice input option
        if st.button("Speak to the Bot"):
            user_input = self.voice_handler.get_voice_input()
            if user_input:
                bot_response = self.response_handler.get_response(
                    user_input, 
                    bot_name, 
                    st.session_state.get("document_search")
                )
                st.markdown(f"**You:** {user_input}")
                st.markdown(f"**{bot_name}:** {bot_response}")
                
                # Optional speech playback
                if st.button("Play Response"):
                    self.voice_handler.text_to_speech(bot_response)

        # Text input
        user_input = st.text_area("Enter your message:", height=100)
        if st.button("Send") and user_input.strip():
            bot_response = self.response_handler.get_response(
                user_input, 
                bot_name, 
                st.session_state.get("document_search")
            )
            st.markdown(f"**You:** {user_input}")
            st.markdown(f"**{bot_name}:** {bot_response}")
            
            # Optional speech playback
            if st.button("Play Response"):
                self.voice_handler.text_to_speech(bot_response)

        # Chat history
        st.subheader("Chat History")
        for chat in st.session_state.get("chat_history", []):
            st.markdown(f"- **You:** {chat['user']}")
            st.markdown(f"  **{bot_name}:** {chat['bot']}")

        # Start New Chat button
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

        #clear cache
        st.header("Session Management")
        if st.button("Clear All"):
            st.session_state.clear()  # Clear all session state variables
            st.success("All session cache cleared successfully!")


def main():
    app = ChatbotApp()
    app.main()

if __name__ == "__main__":
    main()