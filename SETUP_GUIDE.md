# CodeMentor AI - Setup Guide

Complete setup instructions for the CodeMentor AI project.

## 📋 Prerequisites Checklist

- [ ] Python 3.8 or higher installed
- [ ] Node.js 16 or higher installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] OpenAI API key (get one at https://platform.openai.com/api-keys)
- [ ] Git installed (optional, for version control)

## 🚀 Step-by-Step Setup

### Step 1: Verify Prerequisites

```bash
# Check Python version
python --version

# Check Node.js version
node --version

# Check MongoDB (if installed locally)
mongod --version
```

### Step 2: MongoDB Setup

**Option A: Local MongoDB**

1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Or run manually
   mongod
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Whitelist your IP address in Network Access

### Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and save it securely (you'll need it in Step 5)

### Step 4: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# This will install:
# - fastapi (web framework)
# - uvicorn (ASGI server)
# - motor (async MongoDB driver)
# - pymongo (MongoDB driver)
# - python-jose (JWT tokens)
# - passlib (password hashing)
# - openai (OpenAI API client)
# - pydantic (data validation)
# - python-dotenv (environment variables)
# - websockets (WebSocket support)
```

### Step 5: Configure Backend Environment

The `.env` file is already created. Update it with your credentials:

```bash
# Open .env file and update:

# MongoDB connection (local)
MONGODB_URL=mongodb://localhost:27017

# OR MongoDB Atlas (cloud)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Database name
DATABASE_NAME=codementor_ai

# JWT Secret (generate a random string for production)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production-abc123xyz789

# OpenAI API Key (REQUIRED - replace with your actual key)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Rate limiting (optional - defaults shown)
RATE_LIMIT_REQUESTS=50
RATE_LIMIT_WINDOW_MINUTES=60
```

### Step 6: Test Backend

```bash
# Make sure you're in the backend directory
cd backend

# Start the server
python -m app

# You should see:
# ✅ Connected to MongoDB
# INFO: Uvicorn running on http://0.0.0.0:8000
```

**Verify Backend is Working:**
- Open browser to http://localhost:8000
- You should see: `{"message": "Welcome to CodeMentor AI API", ...}`
- Open http://localhost:8000/docs for interactive API documentation

### Step 7: Frontend Setup

Open a NEW terminal window (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# This will install:
# - react & react-dom (UI library)
# - vite (build tool)
# - tailwindcss (CSS framework)
# - axios (HTTP client)
# - react-router-dom (routing)
# - react-ace (code editor)
# - react-markdown (markdown rendering)
# - lucide-react (icons)
# - and more...
```

### Step 8: Start Frontend

```bash
# Make sure you're in the frontend directory
cd frontend

# Start development server
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:3000/
```

### Step 9: Access Application

Open your browser and go to: **http://localhost:3000**

You should see the CodeMentor AI login/register page!

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] MongoDB connected (check backend console for "✅ Connected to MongoDB")
- [ ] Frontend running on http://localhost:3000
- [ ] Can access http://localhost:8000/docs (API documentation)
- [ ] Can see login page at http://localhost:3000

## 🎯 First Steps After Setup

### 1. Create an Account

- Go to http://localhost:3000/register
- Enter username, email, and password
- Click "Create Account"
- You'll be automatically logged in

### 2. Try the Dashboard

- You'll see a code editor and AI chat panel
- Select an AI mode (Generate, Debug, or Explain)
- Type a prompt like: "Create a Python function to sort a list"
- Click send and watch the AI respond in real-time!

### 3. Save a Snippet

- After generating code, click "Save" button
- Enter a title for your snippet
- Go to "Snippets" page to see all saved code

### 4. Try Team Mode

- Click "Team Mode" in navigation
- Create a room with any unique ID (e.g., "my-team-room")
- Share the room link with others
- Chat and collaborate with AI together

## 🐛 Common Issues & Solutions

### Issue: "Module not found" error in backend

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URL in `.env` file
- For Atlas: Check network access whitelist

### Issue: "OpenAI API error" or "Invalid API key"

**Solution:**
- Check your API key in `.env` file
- Verify you have credits at https://platform.openai.com/account/usage
- Make sure there are no extra spaces in the API key

### Issue: Frontend shows blank page

**Solution:**
```bash
cd frontend
# Delete node_modules and reinstall
rmdir /s node_modules
npm install
npm run dev
```

### Issue: Port 8000 or 3000 already in use

**Solution:**
```bash
# For Windows, kill process on port
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change ports in:
# Backend: app/__main__.py (change port=8000)
# Frontend: vite.config.js (change server.port)
```

### Issue: WebSocket connection failed

**Solution:**
- Ensure backend is running
- Check that JWT token is valid (try logging out and back in)
- Clear browser localStorage

## 📚 Next Steps

### Learn the API

- Visit http://localhost:8000/docs
- Try out different endpoints
- Read the API documentation

### Customize the Project

- Change colors in `frontend/tailwind.config.js`
- Add new AI modes in backend routes
- Modify rate limits in `.env`

### Deploy to Production

**Backend:**
- Use a production WSGI server (gunicorn)
- Use managed MongoDB (Atlas)
- Set strong JWT_SECRET_KEY
- Enable HTTPS

**Frontend:**
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static host
- Update API URLs in environment variables

## 🔧 Development Workflow

### Running Both Services

**Terminal 1 (Backend):**
```bash
cd backend
python -m app
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Making Changes

- Backend: Edit Python files, server auto-reloads
- Frontend: Edit React files, page auto-refreshes (HMR)

### Stopping Services

- Press `Ctrl+C` in each terminal to stop

## 📞 Need Help?

- Check the main README.md
- Review backend/README.md for API details
- Review frontend/README.md for UI details
- Check error messages in browser console (F12)
- Check error messages in backend terminal

## 🎉 You're All Set!

Your CodeMentor AI application is now ready to use. Happy coding! 🚀
