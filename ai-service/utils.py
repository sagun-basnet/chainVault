# utils.py

import os
import docx2txt
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import pandas as pd

def get_file_extension(filename):
    return os.path.splitext(filename)[1].lower()

def extract_text_from_file(file_path):
    ext = get_file_extension(file_path)
    
    if ext == ".docx":
        return docx2txt.process(file_path)

    elif ext == ".pdf":
        text = ""
        with fitz.open(file_path) as pdf:
            for page in pdf:
                text += page.get_text()
        return text

    elif ext in [".jpg", ".jpeg", ".png"]:
        img = Image.open(file_path)
        return pytesseract.image_to_string(img)

    elif ext in [".py", ".js", ".txt"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    elif ext == ".csv":
        df = pd.read_csv(file_path)
        return df.to_string()

    elif ext == ".xlsx":
        df = pd.read_excel(file_path, engine="openpyxl")
        return df.to_string()

    else:
        return ""
