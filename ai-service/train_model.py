import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

training_data = {
    "documents": """
        report contract proposal meeting minutes document pdf docx text letter
        analysis summary research agreement abstract introduction conclusion
        table of contents appendix reference bibliography
    """,

    "images": """
        photo picture image jpeg jpg png bmp gif gallery screenshot pixel resolution
        portrait landscape wallpaper filter camera exposure iso aperture focal
        depth shutter exif metadata lens color rgb cmyk
    """,

    "code": """
        function variable const let var import export class def return console.log
        public static void main system.out.println if else elif loop for while print
        try catch finally lambda => <> {} [] HTML CSS JavaScript Python React Node
        Express Django Flask SQL SELECT INSERT UPDATE DELETE API endpoint request
        response json parse stringify require module exports async await
    """,

    "spreadsheets": """
        spreadsheet excel csv xlsx data cell formula sum average pivot chart table
        rows columns filter sort sheet workbook range value percentage sumif vlookup
        hlookup index match
    """
}

# Combine all category texts
all_texts = list(training_data.values())

# Fit TF-IDF on all category data
vectorizer = TfidfVectorizer()
vectorizer.fit(all_texts)

# Create vectors for each category
category_labels = {}
for cat, text in training_data.items():
    category_labels[cat] = vectorizer.transform([text])

# Save models
pickle.dump(vectorizer, open('models/tfidf_vectorizer.pkl', 'wb'))
pickle.dump(category_labels, open('models/category_labels.pkl', 'wb'))
pickle.dump({}, open('models/file_vectors.pkl', 'wb'))  # Empty initially

print("✅ Model trained with real-world category keywords")
