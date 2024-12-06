import os
from PyPDF2 import PdfReader
from docx import Document

def process_pdf(file):
    """Extract text from uploaded PDF file."""
    reader = PdfReader(file)
    return [page.extract_text() for page in reader.pages]

def process_docx(file):
    """Extract text from .docx file."""
    doc = Document(file)
    return [para.text for para in doc.paragraphs if para.text]

def process_txt(file):
    """Extract text from .txt file."""
    return file.read().decode('utf-8').splitlines()

def process_uploaded_file(file):
    """Determine file type and process accordingly."""
    file_extensions = {
        ".pdf": process_pdf,
        ".docx": process_docx,
        ".txt": process_txt
    }
    
    processor = file_extensions.get(os.path.splitext(file.name)[1])
    if processor:
        return processor(file)
    
    raise ValueError("Unsupported file type. Please upload a .pdf, .docx, or .txt file.")