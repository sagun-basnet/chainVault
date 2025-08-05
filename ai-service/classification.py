# classification.py
import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

MODEL_PATH = "models/classifier.pkl"
VEC_PATH = "models/vectorizer.pkl"

def train_classifier(data):
    texts = [item["text"] for item in data]
    labels = [item["label"] for item in data]

    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)

    clf = MultinomialNB()
    clf.fit(X, labels)

    os.makedirs("models", exist_ok=True)
    pickle.dump(clf, open(MODEL_PATH, "wb"))
    pickle.dump(vectorizer, open(VEC_PATH, "wb"))

def classify_text(text):
    if not os.path.exists(MODEL_PATH):
        return "Model not trained"

    clf = pickle.load(open(MODEL_PATH, "rb"))
    vectorizer = pickle.load(open(VEC_PATH, "rb"))

    X = vectorizer.transform([text])
    return clf.predict(X)[0]
