from marshmallow import Schema, fields
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from connection import get_database
from bson import ObjectId

load_dotenv()

# Configure MongoDB
db = get_database()
chatbots_collection = db["chatbots"]

class InputFieldSchema(Schema):
    label = fields.Str(required=True)
    placeholder = fields.Str(required=False, load_default="", dump_default="")

class UploadFieldSchema(Schema):
    label = fields.Str(required=True)

class ChoiceFieldSchema(Schema):
    label = fields.Str(required=True)
    options = fields.List(fields.Str(), required=False, default=[])

class TicketFieldsSchema(Schema):
    input = fields.List(fields.Nested(InputFieldSchema), required=True)
    uploading = fields.List(fields.Nested(UploadFieldSchema), required=True)
    choice = fields.List(fields.Nested(ChoiceFieldSchema), required=True)

class FrameworkSchema(Schema):
    project_name = fields.Str(required=True)
    ticket_fields = fields.Nested(TicketFieldsSchema, required=True)
    boat_name = fields.Str(required=True)
    boat_iframeurl = fields.Str(required=True)
    qa = fields.Str(required=True, data_key="q&A")
    port_number = fields.Int(required=True)

# function to add data
def create_custom_framework(
    project_name: str,
    input_fields: list,
    upload_fields: list,
    choice_fields: list,
    boat_name: str,
    boat_iframeurl: str,
    qa: str,
    port_number: int
):
    framework_data = {
        "project_name": project_name,
        "ticket_fields": {
            "input": input_fields,
            "uploading": upload_fields,
            "choice": choice_fields
        },
        "boat_name": boat_name,
        "boat_iframeurl": boat_iframeurl,
        "q&A": qa,
        "port_number": port_number
    }
    
    schema = FrameworkSchema()
    validated_data = schema.load(framework_data)
    
    result = chatbots_collection.insert_one(validated_data)
    return result.inserted_id

def get_custom_framework(project_name: str):
    try:
        # Log the project name for debugging
        print(f"Fetching framework with project name: {project_name}")
        
        # Fetch the framework data from the database using project name
        framework = chatbots_collection.find_one({"project_name": project_name})
    
        if not framework:
            raise ValueError("Framework not found")
    
        # Convert ObjectId to string for JSON serialization
        framework["_id"] = str(framework["_id"])
        
        return framework
    except Exception as e:
        raise ValueError(f"Error retrieving framework: {str(e)}")