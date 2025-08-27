# train_from_files.py
import os
import joblib
from utils import extract_text_from_file
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import make_pipeline

BASE_DIR = "training_files"
CATEGORIES = ["documents", "images", "code", "spreadsheets"]
MODEL_PATH = "models/classifier.pkl"

def load_training_data():
    texts, labels = [], []
    for category in CATEGORIES:
        folder = os.path.join(BASE_DIR, category)
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                content = extract_text_from_file(file_path)
                ext = os.path.splitext(filename)[1].lower()
                
                if ext in [".jpg", ".jpeg", ".png"]:
                    content = f"[IMAGE_FILE] {content}"
                elif ext in [".csv", ".xlsx"]:
                    content = f"[SPREADSHEET_FILE] {content}"
                elif ext in [".py", ".js"]:
                    content = f"[CODE_FILE] {content}"
                else:
                    content = f"[DOCUMENT_FILE] {content}"

                if content.strip():
                    texts.append(content)
                    labels.append(category)
            except Exception as e:
                print(f"❌ Failed to process {file_path}: {e}")
    return texts, labels

def train_and_save_model():
    texts, labels = load_training_data()
    if not texts:
        raise ValueError("No training data found!")

    model = make_pipeline(TfidfVectorizer(), LinearSVC())
    model.fit(texts, labels)
    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained and saved to", MODEL_PATH)

if __name__ == "__main__":
    train_and_save_model()
