import os
from PyPDF2 import PdfReader
from docx import Document

def process_pdf(file):
    """Extract text from uploaded PDF file."""
    try:
        reader = PdfReader(file)
        return [page.extract_text() for page in reader.pages if page.extract_text()]
    except Exception as e:
        raise RuntimeError(f"Error processing PDF: {e}")

def process_docx(file):
    """Extract text from .docx file."""
    try:
        doc = Document(file)
        return [para.text for para in doc.paragraphs if para.text.strip()]
    except Exception as e:
        raise RuntimeError(f"Error processing DOCX: {e}")

def process_txt(file):
    """Extract text from .txt file."""
    try:
        return file.read().decode('utf-8').splitlines()
    except Exception as e:
        raise RuntimeError(f"Error processing TXT: {e}")

def process_uploaded_file(file):
    """Process uploaded file based on its type."""
    file_extensions = {
        ".pdf": process_pdf,
        ".docx": process_docx,
        ".txt": process_txt
    }
    try:
        extension = os.path.splitext(file.name)[1]
        processor = file_extensions.get(extension)
        if processor:
            return processor(file)
        raise ValueError(f"Unsupported file type: {extension}. Use .pdf, .docx, or .txt.")
    except Exception as e:
        raise RuntimeError(f"Error processing uploaded file: {e}")
