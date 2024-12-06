import os
import uuid
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

class ModelManager:
    def __init__(self, user_models_dir='user_models'):
        self.USER_MODELS_DIR = user_models_dir
        os.makedirs(self.USER_MODELS_DIR, exist_ok=True)

    def generate_user_id(self):
        """Generate a unique user ID."""
        return str(uuid.uuid4())

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

    # Commented out model saving/loading for now due to potential serialization complexities
    # You might need to implement a more robust method for saving and loading FAISS indexes
    # def save_model_for_user(self, document_search, user_id):
    #     """Save the trained model for a specific user."""
    #     user_model_dir = os.path.join(self.USER_MODELS_DIR, user_id)
    #     os.makedirs(user_model_dir, exist_ok=True)
        
    #     if document_search:
    #         document_search.save_local(user_model_dir)

    # def load_model_for_user(self, user_id):
    #     """Load the trained model for a specific user."""
    #     user_model_dir = os.path.join(self.USER_MODELS_DIR, user_id)
    #     embeddings = OpenAIEmbeddings()
        
    #     try:
    #         return FAISS.load_local(user_model_dir, embeddings)
    #     except Exception as e:
    #         print(f"Error loading model: {e}")
    #         return None