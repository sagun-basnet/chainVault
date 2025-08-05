import pickle
from utils import preprocess_text
from sklearn.metrics.pairwise import cosine_similarity

vectorizer = pickle.load(open('models/tfidf_vectorizer.pkl', 'rb'))
file_vectors = pickle.load(open('models/file_vectors.pkl', 'rb'))  # {file_id: vector}

def semantic_search(query):
    """Search files using semantic similarity"""
    processed_query = preprocess_text(query)
    query_vector = vectorizer.transform([processed_query])

    similarities = []
    for file_id, file_vector in file_vectors.items():
        sim = cosine_similarity(query_vector, file_vector).flatten()[0]
        similarities.append((file_id, sim))

    similarities.sort(key=lambda x: x[1], reverse=True)
    return [{"file_id": fid, "score": round(score, 4)} for fid, score in similarities]
