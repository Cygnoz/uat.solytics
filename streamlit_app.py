import streamlit as st
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
import os

# Importing custom modules
from file_processing import process_uploaded_file
from link_scraping import scrape_links
from contact_info import extract_contact_info
from data_processing import process_scraped_data
from response_handling import get_response
from voice_and_audio import get_voice_input, text_to_speech
from embed_handling import generate_embed_codes

class ChatbotApp:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize API key
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            st.error("OpenAI API key is missing. Please set it in your .env file.")
            raise ValueError("OPENAI_API_KEY is missing in the environment variables")

        # Create an instance of ChatOpenAI
        chat_model = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            openai_api_key=self.api_key,
        )

        # Initialize QA chain using the model
        self.chain = load_qa_chain(chat_model, chain_type="stuff")
        
        # Initialize session state
        if "chat_history" not in st.session_state:
            st.session_state["chat_history"] = []
        if "conversation_context" not in st.session_state:
            st.session_state["conversation_context"] = ""
        if "scraped_texts" not in st.session_state:
            st.session_state["scraped_texts"] = []
        if "contact_info" not in st.session_state:
            st.session_state["contact_info"] = {}
        if "document_search" not in st.session_state:
            st.session_state["document_search"] = None

def main():
    # Initialize ChatbotApp
    app = ChatbotApp()

    # Streamlit configuration
    st.set_page_config(page_title="Chitti Boy", layout="wide")
    st.title("🤖 Cygnoz Intelligence")

    # Sidebar for training options
    with st.sidebar:
        st.header("Setup")
        bot_name = st.text_input("Enter the bot name", value="Chatbot")
        st.markdown("##### Choose how to train the bot: Website scraping, document upload, or manual input.")
        
        training_option = st.radio("How do you want to train the bot?", 
                                    ("Website URL", "Document Upload", "Manual Input"))
        
        # Handle training options
        if training_option == "Website URL":
            website = st.text_input("Enter the website URL")
            if st.button("Scrape Website"):
                if website:
                    st.info(f"Scraping website: {website}")
                    scraped_texts, contact_info = scrape_links(website)
                    if scraped_texts:
                        st.session_state["scraped_texts"] = scraped_texts
                        st.session_state["contact_info"] = contact_info
                        st.session_state["document_search"] = process_scraped_data(scraped_texts)
                        st.success(f"Scraping completed! Start chatting with {bot_name}.")
                        if contact_info:
                            st.write("### Extracted Contact Information:")
                            st.json(contact_info)
                    else:
                        st.error("No data was scraped from the website. Please verify the URL and try again.")


        elif training_option == "Document Upload":
            uploaded_file = st.file_uploader("Upload a document (.pdf, .docx, .txt)", type=["pdf", "docx", "txt"])
            if uploaded_file:
                if st.button("Process Document"):
                    file_texts = process_uploaded_file(uploaded_file)
                    if file_texts:
                        combined_text = "\n".join(file_texts)
                        contact_info = extract_contact_info(combined_text)
                        st.session_state["contact_info"] = contact_info
                        st.session_state["document_search"] = process_scraped_data(file_texts)
                        st.success(f"Document processed successfully! Start chatting with {bot_name}.")
                        if contact_info:
                            st.write("### Extracted Contact Information:")
                            st.json(contact_info)
                    else:
                        st.error("The uploaded document did not contain valid text. Please try another file.")

        
        elif training_option == "Manual Input":
            manual_text = st.text_area("Enter your text data:")
            if st.button("Process Manual Input"):
                if manual_text.strip():
                    manual_texts = manual_text.splitlines()
                    st.session_state["scraped_texts"] = manual_texts
                    contact_info = extract_contact_info(manual_texts)
                    st.session_state["contact_info"] = contact_info
                    st.session_state["document_search"] = process_scraped_data(manual_texts)
                    st.success(f"Manual input processed! Start chatting with {bot_name}.")
                    if contact_info:
                        st.write("### Extracted Contact Information:")
                        st.json(contact_info)

    # Chat Interface
    st.subheader(f"Chat with {bot_name}")

    # Voice Input Handling
    if st.button("Speak to the Bot", key="voice_input"):
        user_input = get_voice_input()
        if user_input:
            st.markdown(f"**You:** {user_input}")
            bot_response = get_response(
                user_input, 
                app.chain, 
                st.session_state.get("document_search"), 
                st.session_state.get("contact_info", {}), 
                bot_name
            )
            st.markdown(f"**{bot_name}:** {bot_response}")
            
            # Update chat history
            st.session_state["chat_history"].append({
                'user': user_input,
                'bot': bot_response
            })

        if st.button("Play Response", key="play_voice"):
            audio_file = text_to_speech(bot_response)
            st.audio(audio_file)


    # Text Input
    user_input = st.text_area("Enter your message:", height=100)
    if st.button("Send") and user_input.strip():
        bot_response = get_response(
            user_input, 
            app.chain, 
            st.session_state.get("document_search"), 
            st.session_state.get("contact_info", {}), 
            bot_name
        )
        st.markdown(f"**You:** {user_input}")
        st.markdown(f"**{bot_name}:** {bot_response}")
        
        # Update chat history
        st.session_state["chat_history"].append({
            'user': user_input,
            'bot': bot_response
        })

        if st.button("Play Response"):
            text_to_speech(bot_response)

    # # Display Contact Information
    # if st.session_state.get("contact_info"):
    #     st.subheader("Extracted Contact Information")
    #     st.json(st.session_state["contact_info"])

    # Chat History
    st.subheader("Chat History")
    for chat in st.session_state.get("chat_history", []):
        st.markdown(f"**You:** {chat['user']}")
        st.markdown(f"**{bot_name}:** {chat['bot']}")

    # Clear chat history button
    if st.button("Start New Chat", key="reset_chat"):
        for key in ["chat_history", "conversation_context", "scraped_texts", "contact_info", "document_search"]:
            st.session_state[key] = []
        st.success("Chat has been reset. You can start a new conversation!")


if __name__ == "__main__":
    main()