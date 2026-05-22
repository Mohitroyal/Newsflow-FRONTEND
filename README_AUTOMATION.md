# 🚀 NewsCraft AI Automation Guide

To make development as smooth as possible, I've created a central automation script that handles everything for you.

## 🛠️ One-Command Setup
Simply run the following command from the root directory:

```powershell
python dev.py
```

### What this script does:
1.  **Backend Setup**:
    *   Installs all Python dependencies from `requirements.txt`.
    *   **Automated Database Setup**: Connects to your Supabase PostgreSQL and creates all necessary tables (`users`, `clippings`, `usage`, etc.).
    *   Starts the **FastAPI** server at `http://localhost:8000`.
2.  **Frontend Setup**:
    *   Installs all Node dependencies using `npm install`.
    *   Starts the **Next.js** server at `http://localhost:3000`.

---

## 🏗️ Manual Commands (If needed)

### Initialize Database Only
If you just want to update your database schema:
```powershell
cd backend
$env:PYTHONPATH="."
python app/db/init_db.py
```

### Start Frontend Only
```powershell
npm run dev
```

### Start Backend Only
```powershell
cd backend
uvicorn app.main:app --reload
```

---

## 🔒 Security Note
Your `.env` and `.env.local` files have been populated with the keys you provided. Ensure these files are **not** committed to public repositories.
