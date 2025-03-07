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
    choice = fields.List(fields.Nested(ChoiceFieldSchema), required=False)

class ThemeSchema(Schema):
    backgroundColor = fields.Str(required=False)
    textColor = fields.Str(required=False)
    
class FrameworkSchema(Schema):
    project_name = fields.Str(required=False)
    description = fields.Str(required=False)
    bot_image = fields.Str(required=False)
    ticket_fields = fields.Nested(TicketFieldsSchema, required=False)
    boat_name = fields.Str(required=False)
    boat_iframeurl = fields.Str(required=False)
    # port_number = fields.Int(required=False)
    domain = fields.Str(required=False)
    theme = fields.List(fields.Nested(ThemeSchema), required=False)
    agent = fields.Bool(required=False, default=False)
    qa = fields.Bool(required=False, default=False)
    insight = fields.Bool(required=False, default=False)
    forecast = fields.Bool(required=False, default=False)
    upload = fields.Bool(required=False, default=False)
    ticketSubject = fields.Str(required=False)
    ticketDescription = fields.Str(required=False)
    website = fields.Str(required=False, allow_none=True)
    file = fields.Str(required=False, allow_none=True)
    text = fields.Str(required=False, allow_none=True)

# function to add data
def create_custom_framework(data):
    try:
        print("Received data:", data) 
        
        # Extract ticket fields more safely
        ticket_fields = data.get('ticket_fields', {})
        input_fields = ticket_fields.get('input', [])
        choice_fields = ticket_fields.get('choice', [])
        
        # Map input fields correctly
        mapped_input_fields = [
            {
                "label": field.get("label", ""),  
                "placeholder": field.get("placeholder", "")  
            } 
            for field in input_fields
        ]
        
        # Extract theme data properly
        theme_data = data.get('theme', {})
        if isinstance(theme_data, dict):
            theme = [{
                "backgroundColor": theme_data.get('backgroundColor', ''),
                "textColor": theme_data.get('textColor', '')
            }]
        else:
            theme = theme_data

        framework_data = {
            "project_name": data.get('project_name', ''), 
            "ticket_fields": {
                "input": mapped_input_fields,  
                "choice": choice_fields
            },
            "boat_name": data.get('project_name', ''),  
            "description": data.get('description', ''),
            "domain": data.get('domain', ''),
            "boat_iframeurl": data.get('boat_iframeurl', ''),
            "bot_image": data.get('image', ''),
            "theme": theme,
            "agent": data.get('agent'),
            "qa": data.get('qa'),
            "insight": data.get('insight'),
            "forecast": data.get('forecast', False) or False,
            "upload": data.get('upload'),
            "ticketSubject": data.get('ticketSubject', ''),
            "ticketDescription": data.get('ticketDescription', '')
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

        framework = framework_collection.find_one({"project_name": project_name})
    
        if not framework:
            raise ValueError("Framework not found")
    
        # Convert ObjectId to string for JSON serialization
        framework["_id"] = str(framework["_id"])
        
        return framework
    except Exception as e:
        raise ValueError(f"Error retrieving framework: {str(e)}")
    

# Your get_all_frameworks function
def get_all_frameworks():
    try:
        frameworks = list(framework_collection.find())
        if not frameworks:
            raise ValueError("No frameworks found")
        for framework in frameworks:
            framework["_id"] = str(framework["_id"])
        return frameworks
    except Exception as e:
        raise ValueError(f"Error retrieving frameworks: {str(e)}")