# app.py

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from utils import extract_text_from_file
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()
model = joblib.load("models/classifier.pkl")

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    temp_path = f"temp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        text = extract_text_from_file(temp_path)
        if not text.strip():
            return {"error": "Empty or unreadable content"}
        prediction = model.predict([text])[0]
        return {"filename": file.filename, "category": prediction}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/classify/")
async def classify_file(file: UploadFile = File(...)):
    contents = await file.read()
    temp_path = f"temp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        text = extract_text_from_file(temp_path)
        prediction = model.predict([text])[0]
        return {"category": prediction}
    except Exception as e:
        return {"error": str(e)}

@app.get("/search/")
def search(query: str):
    from train_from_files import load_training_data
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
