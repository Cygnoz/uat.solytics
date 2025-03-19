from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
def get_database():
    try:
        mongo_uri = os.getenv("MONGO_URI")
        client = MongoClient(mongo_uri)

        # dev db
        # database_name = "chatbot_db"
        # Sit Db
        database_name="SolysticSIT"
        db = client[database_name]
        chatbots_collection = db['chatbots']
        
        print("Successfully connected to the database.")
        return db
    except Exception as e:
        print(f"An error occurred while connecting to the database: {e}")
        return None

# Uncomment the following lines to test the connection
if __name__ == "__main__":
     db = get_database()
