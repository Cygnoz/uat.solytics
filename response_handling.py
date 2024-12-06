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