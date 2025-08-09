# utils.py

import os
import docx2txt
import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import pandas as pd
import cv2
import numpy as np

def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)            # Convert to grayscale
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)  # Binarize
    return Image.fromarray(thresh)

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
        text = pytesseract.image_to_string(img)
        # If OCR returns nothing, mark it specially
        return text if text.strip() else "[[IMAGE_NO_TEXT]]"

    elif ext in [".py", ".js", ".jsx", ".ts", ".java", ".cpp", ".c", ".txt"]:
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
