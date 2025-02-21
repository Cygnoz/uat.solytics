from marshmallow import Schema, fields
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from connection import get_database
from bson import ObjectId

load_dotenv()

# Configure MongoDB
db = get_database()
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["chatbot_db"]
framework_collection = db["frameworks"]

class InputFieldSchema(Schema):
    label = fields.Str(required=False)
    placeholder = fields.Str(required=False, load_default="", dump_default="")

class UploadFieldSchema(Schema):
    label = fields.Str(required=False)

class ChoiceFieldSchema(Schema):
    label = fields.Str(required=False)
    options = fields.List(fields.Str(), required=False, default=[])

class TicketFieldsSchema(Schema):
    input = fields.List(fields.Nested(InputFieldSchema), required=False)
    uploading = fields.List(fields.Nested(UploadFieldSchema), required=False)
    choice = fields.List(fields.Nested(ChoiceFieldSchema), required=False)

class FrameworkSchema(Schema):
    project_name = fields.Str(required=False)
    ticket_fields = fields.Nested(TicketFieldsSchema, required=False)
    boat_name = fields.Str(required=False)
    boat_iframeurl = fields.Str(required=False)
    qa = fields.Str(required=False, data_key="q&A")
    port_number = fields.Int(required=False)

# function to add data
def create_custom_framework(data):
    try:
        framework_data = {
            "project_name": data.get('name', ''),
            "ticket_fields": {
                "input": [{"label": field["title"]} for field in data.get('ticketForm', {}).get('fields', []) if field["type"] == "text"],
                "uploading": [{"label": field["title"]} for field in data.get('ticketForm', {}).get('fields', []) if field["type"] == "upload"],
                "choice": [{"label": field["title"], "options": field["content"]} for field in data.get('ticketForm', {}).get('fields', []) if field["type"] == "choice"]
            },
            "boat_name": data.get('name', ''),
            "boat_iframeurl": data.get('iframeUrl', ''),
            "q&A": data.get('description', ''),
            "port_number": int(data.get('portNumber', 0))
        }
        print('\n Framework data:', framework_data)
        schema = FrameworkSchema()
        validated_data = schema.load(framework_data)
        print('\n Validated data:', validated_data)

        print('\n mongodb collection: ', framework_collection)
        
        result = framework_collection.insert_one(validated_data)
        print('\n Result:', result)

        if not result.inserted_id:
            raise ValueError("Error creating framework")
        
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating framework: {str(e)}")
        raise

def get_custom_framework(project_name: str):
    try:
        
        # Fetch the framework data from the database using project name
        framework = framework_collection.find_one({"project_name": project_name})
    
        if not framework:
            raise ValueError("Framework not found")
    
        # Convert ObjectId to string for JSON serialization
        framework["_id"] = str(framework["_id"])
        
        return framework
    except Exception as e:
        raise ValueError(f"Error retrieving framework: {str(e)}")