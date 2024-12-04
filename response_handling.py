from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI

def initialize_qa_chain():
    """
    Initialize a QA chain with the OpenAI Chat model.

    Returns:
        QAChain: An instance of the QA chain.
    """
    return load_qa_chain(ChatOpenAI(model_name="gpt-3.5-turbo"), chain_type="stuff")

def get_response(user_input, chain, document_search, contact_info, bot_name):
    """
    Generate a response based on user input.

    Args:
        user_input (str): The user's input.
        chain (QAChain): The initialized QA chain.
        document_search: The document search engine instance.
        contact_info (dict): Extracted contact information.
        bot_name (str): Name of the bot.

    Returns:
        str: Bot's response.
    """
    if not user_input.strip():
        return "Please provide a valid query."

    # Contact Info Keywords
    if any(kw in user_input.lower() for kw in ["email", "phone", "contact", "address"]):
        contact_type = next((kw for kw in ["email", "phone", "address"] if kw in user_input.lower()), None)
        results = contact_info.get(f"{contact_type}s", [])
        return f"Here are the {contact_type}s found: {', '.join(results)}" if results else f"No {contact_type}s found."

    # Document Search
    if document_search:
        docs = document_search.similarity_search(user_input)
        if docs:
            try:
                kb_response = chain.run(input_documents=docs, question=user_input)
                return kb_response.replace("Based on the provided context, ", "").strip()
            except Exception as e:
                return f"Error generating response: {e}"

    return "Ask questions related to the provided data or train the bot with new inputs."
