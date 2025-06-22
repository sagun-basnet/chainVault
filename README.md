# 🚀 ChainVault – AI-Enabled File Management System with Blockchain Integrity

ChainVault is a secure and intelligent file management platform that allows users to upload, classify, search, and share files with enhanced transparency and integrity. It leverages **AI-based classification** and **blockchain logging** to ensure data authenticity — all without relying on cryptocurrency.

---

## 🔒 Key Features

- 🔐 **User Authentication & Authorization**

  - JWT-based login/register
  - Role-based access control (User, Admin)

- 📁 **File Upload & Management**

  - Upload single or multiple files
  - Organize files with folders and tags
  - Rename, move, or delete files

- 🤖 **AI-Based File Classification**

  - NLP-based classification (TF-IDF + Cosine Similarity)
  - Automatic detection of file type (document, code, image, etc.)

- 🔍 **Smart Semantic Search**

  - Context-aware keyword search
  - Fuzzy matching and content-based similarity

- 🔗 **Secure File Sharing**

  - Share files via link with password/expiry
  - Download/view-only permissions
  - All share actions are blockchain-logged

- 🛡️ **Blockchain Integrity Logging**

  - Every file action (upload, update, delete, share) is hashed and stored
  - Ensures tamper-proof audit trails
  - No tokens or cryptocurrency involved

- 📊 **Admin Dashboard**
  - Monitor users and files
  - View suspicious activity logs
  - Manage complaints and reports

---

## 🏗️ Tech Stack

| Layer      | Technologies Used                             |
| ---------- | --------------------------------------------- |
| Frontend   | React.js, Tailwind CSS                        |
| Backend    | Node.js, Express.js                           |
| Database   | MySQL                                         |
| AI Layer   | Python (Flask), scikit-learn, nltk/spaCy      |
| Blockchain | Ganache / Polygon Mumbai Testnet, Solidity    |
| Storage    | Local Server or Cloudinary (optional), Multer |
| Security   | JWT, bcrypt, helmet, CORS                     |

---

## 🧠 AI Algorithms Used

- **TF-IDF (Term Frequency–Inverse Document Frequency)**  
  Vectorizes file content based on word importance

- **Cosine Similarity**  
  Measures similarity between uploaded file and trained categories

Used for both **file classification** and **semantic search**.

---

## 🔗 Blockchain Use Cases (Non-Crypto)

| Action             | Blockchain Log Description                   |
| ------------------ | -------------------------------------------- |
| File Upload        | Stores file hash on-chain                    |
| File Share         | Logs sharing metadata and access permissions |
| File Update/Delete | Logs change actions for traceability         |
| Integrity Audit    | Verifiable proof of file authenticity        |

> ✔ Smart Contract stores: `fileHash`, `action`, `userId`, `timestamp`

---

## 📐 System Architecture

React.js (Frontend)
↓
Node.js + Express (Backend API)
↓
MySQL (Database)
↘
Flask (AI NLP Microservice)
↘
Blockchain (Ganache / Polygon)

---

## 🧪 Development & Testing Tools

| Purpose         | Tools Used                        |
| --------------- | --------------------------------- |
| API Testing     | Postman                           |
| Version Control | Git, GitHub                       |
| Hosting         | Vercel (frontend), Railway/Render |
| Blockchain Dev  | Hardhat, Ganache, Remix           |
| AI & NLP        | Flask, scikit-learn, nltk/spaCy   |
| DB Management   | MySQL Workbench / phpMyAdmin      |

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/chainvault.git
cd chainvault

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Setup Flask AI microservice
cd ../ai-service
pip install -r requirements.txt

# Run all services
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev

# Flask AI Microservice
cd ../ai-service
python app.py
Make sure MySQL and Ganache/Polygon RPC are running, and environment variables are set accordingly.

💡 Why ChainVault?
✅ Combines AI + Blockchain in a real-world use case

✅ Practical file management with semantic intelligence

✅ Secure actions with immutable logging

✅ No crypto, no tokens – just pure utility

✅ Ideal for teams, freelancers, legal firms, and enterprises

👨‍💻 Contributors
Sagun Basnet – Full Stack Developer, AI + Blockchain Integrator

Feel free to fork and contribute to the project!

📃 License
This project is licensed under the MIT License.
```
