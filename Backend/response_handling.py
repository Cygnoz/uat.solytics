import streamlit as st
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain

class ResponseHandler:
    def __init__(self):
        # Initialize QA chain
        self.chain = load_qa_chain(ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff")

    def get_response(self, user_input, bot_name, document_search):
        """Retrieve contextual response based on input."""
        if not document_search:
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
        docs = document_search.similarity_search(user_input)
        
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

# from flask import Flask, request, jsonify
# from bson import ObjectId
# import logging
# from langchain_openai import ChatOpenAI, OpenAIEmbeddings
# from langchain.chains.question_answering import load_qa_chain
# from langchain.text_splitter import CharacterTextSplitter
# from langchain_community.vectorstores import FAISS
# from typing import Optional, Dict
# import json

# class ResponseHandler:
#     def __init__(self, model_name: str = "gpt-3.5-turbo"):
#         """Initialize ResponseHandler with configuration."""
#         try:
#             self.chain = load_qa_chain(
#                 ChatOpenAI(model_name=model_name), 
#                 chain_type="stuff"
#             )
#             self.embeddings = OpenAIEmbeddings()
#             self.text_splitter = CharacterTextSplitter(
#                 separator="\n",
#                 chunk_size=1000,
#                 chunk_overlap=200,
#                 length_function=len
#             )
#             # Store for caching vector stores
#             self.vector_stores = {}
            
#         except Exception as e:
#             logging.error(f"Failed to initialize ResponseHandler: {str(e)}")
#             raise

#     def _create_vectorstore(self, text: str) -> FAISS:
#         """Create a vector store from text data."""
#         try:
#             texts = self.text_splitter.split_text(text)
#             return FAISS.from_texts(texts, self.embeddings)
#         except Exception as e:
#             logging.error(f"Failed to create vector store: {str(e)}")
#             raise

#     def get_response(self, user_input: str, bot_name: str, document_text: str) -> str:
#         """
#         Get response based on user input and document text.
        
#         Args:
#             user_input (str): User's question
#             bot_name (str): Name of the chatbot
#             document_text (str): Document text for searching
#         """
#         if not user_input.strip():
#             return "Please provide a valid question."

#         if not document_text:
#             return "No knowledge base available for this bot."

#         try:
#             # Create or get cached vector store
#             bot_key = f"{bot_name}_{hash(document_text)}"
#             if bot_key not in self.vector_stores:
#                 self.vector_stores[bot_key] = self._create_vectorstore(document_text)
            
#             vectorstore = self.vector_stores[bot_key]
            
#             # Perform document search
#             docs = vectorstore.similarity_search(user_input)
            
#             if not docs:
#                 return "I couldn't find any relevant information to answer your question."

#             # Generate response
#             kb_response = self.chain.run(input_documents=docs, question=user_input)
#             kb_response = kb_response.replace("Based on the provided context, ", "").strip()
#             kb_response = kb_response.replace("According to the information, ", "").strip()
            
#             return kb_response
            
#         except Exception as e:
#             logging.error(f"Error processing response: {str(e)}")
#             return "I encountered an error while processing your request. Please try again."



