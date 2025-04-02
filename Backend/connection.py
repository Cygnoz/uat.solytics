from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Create a global database connection
_db = None

def get_database():
    global _db
    if _db is None:
        try:
            mongo_uri = os.getenv("MONGO_URI")
            client = MongoClient(mongo_uri)

            # dev db
            database_name = "chatbot_db"

            # sit db
            # database_name = "chatbot_uat"

            # UAT db
            # database_name = "chatbot_uat"


            _db = client[database_name]
            print("Successfully connected to the database.")
        except Exception as e:
            print(f"An error occurred while connecting to the database: {e}")
            return None
    return _db