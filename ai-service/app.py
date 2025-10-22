# app.py

import os
from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from utils import extract_text_from_file
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from collections import Counter
from keybert import KeyBERT
kw_model = KeyBERT()
import re

# Ensure temp folder exists
os.makedirs("temp", exist_ok=True)

app = FastAPI()
model = joblib.load("models/classifier.pkl")

def generate_tags(text):
    if not text.strip() or text.strip() == "[[IMAGE_NO_TEXT]]":
        return []
    
    keywords = kw_model.extract_keywords(text, top_n=10)  # can use 10 for better coverage
    tags = [kw[0] for kw in keywords]

    # Remove duplicates (case-insensitive)
    seen = set()
    unique_tags = []
    for tag in tags:
        tag_lower = tag.lower()
        if tag_lower not in seen:
            seen.add(tag_lower)
            unique_tags.append(tag)

    return unique_tags[:5]  # keep only top 5

@app.post("/retrain/")
def retrain_model():
    """Retrain AI model on updated training data."""
    try:
        from train_from_file import train_and_save_model
        train_and_save_model()
        return {"message": "✅ Model retrained successfully."}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """Single file upload and classification."""
    temp_path = f"temp/{file.filename}"
    contents = await file.read()
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        text = extract_text_from_file(temp_path)

        # Category prediction
        if text.strip() == "[[IMAGE_NO_TEXT]]":
            prediction = "images"
            tags = [file.filename.split('.')[0]]  # simple name-based tag
        elif not text.strip():
            return {"error": "Empty or unreadable content"}
        else:
            prediction = model.predict([text])[0]
            tags = extract_tags_from_text(text)

        return {
            "filename": file.filename,
            "category": prediction,
            "tags": tags
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/upload-multiple/")
async def upload_multiple_files(files: List[UploadFile] = File(description="Multiple files", default=[])):
    """Upload and classify multiple files of different types."""
    results = []

    for file in files:
        temp_path = f"temp/{file.filename}"
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        try:
            text = extract_text_from_file(temp_path)

            # Category prediction
            if text.strip() == "[[IMAGE_NO_TEXT]]":
                prediction = "images"
                tags = [file.filename.split('.')[0]]
            elif not text.strip():
                results.append({
                    "filename": file.filename,
                    "error": "Empty or unreadable content"
                })
                continue
            else:
                prediction = model.predict([text])[0]
                tags = generate_tags(text)

            results.append({
                "filename": file.filename,
                "category": prediction,
                "tags": tags
            })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })

    return {"results": results}


@app.get("/search/")
def search(query: str):
    """Search for the closest matching text in training data."""
    from train_from_file import load_training_data
    texts, labels = load_training_data()
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(texts)
    query_vector = vectorizer.transform([query])
    similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    top_idx = similarities.argmax()
    return {
        "match_text": texts[top_idx][:300],  # Preview
        "category": labels[top_idx],
        "score": float(similarities[top_idx])
    }
