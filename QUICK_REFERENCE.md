# 🚀 CodeMentor AI - Quick Reference

Essential commands and information for CodeMentor AI.

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
install.bat

# 2. Configure OpenAI API key
# Edit backend\.env and add your OpenAI API key

# 3. Start application
start-all.bat
```

**Access**: http://localhost:3000

## 🔧 Common Commands

### Backend

```bash
# Start backend server
cd backend
python -m app

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Check Python version
python --version
```

### Frontend

```bash
# Start frontend dev server
cd frontend
npm run dev

# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### MongoDB

```bash
# Start MongoDB (Windows)
net start MongoDB

# Or start manually
mongod

# Check status
mongosh
```

## 📍 URLs & Ports

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React application |
| **Backend** | http://localhost:8000 | FastAPI server |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **MongoDB** | localhost:27017 | Database |

## 🔑 Environment Variables

### Backend (.env)

```env
# Required
MONGODB_URL=mongodb://localhost:27017
OPENAI_API_KEY=sk-your-key-here

# Optional (defaults shown)
DATABASE_NAME=codementor_ai
JWT_SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=1440
RATE_LIMIT_REQUESTS=50
RATE_LIMIT_WINDOW_MINUTES=60
```

### Frontend (.env - optional)

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 📡 API Endpoints Quick Reference

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### AI
```http
POST   /api/ai/prompt
GET    /api/ai/history
DELETE /api/ai/history/{id}
GET    /api/ai/rate-limit
```

### Snippets
```http
POST   /api/snippets
GET    /api/snippets
GET    /api/snippets/{id}
PUT    /api/snippets/{id}
DELETE /api/snippets/{id}
```

### WebSocket
```
WS /ws/chat?token={jwt}
WS /ws/team/{room_id}?token={jwt}
```

## 💡 Common Tasks

### Create User Account
```bash
# Via UI
1. Go to http://localhost:3000/register
2. Fill in username, email, password
3. Click "Create Account"

# Via API (curl)
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user@example.com","password":"password123"}'
```

### Generate Code with AI
```bash
# Via UI
1. Login to dashboard
2. Select "Generate" mode
3. Type prompt: "Create a Python function to sort a list"
4. Click Send
5. Watch AI respond in real-time

# Via API
curl -X POST http://localhost:8000/api/ai/prompt \
  -H "Authorization: Bearer {your_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a Python sort function","mode":"generate","language":"python"}'
```

### Save Code Snippet
```bash
# Via UI
1. Write or generate code in editor
2. Click "Save" button
3. Enter title
4. View in Snippets page

# Via API
curl -X POST http://localhost:8000/api/snippets \
  -H "Authorization: Bearer {your_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Function","code":"def hello():\n    print(\"Hello\")","language":"python"}'
```

### Join Team Room
```bash
# Via UI
1. Go to Team Mode
2. Enter room ID (e.g., "my-team-room")
3. Click "Join Room"
4. Share link with team: http://localhost:3000/team/my-team-room
```

## 🐛 Quick Troubleshooting

### Backend Won't Start
```bash
# Check MongoDB is running
net start | findstr MongoDB

# Check Python installed
python --version

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Won't Start
```bash
# Check Node installed
node --version

# Clean install
rmdir /s node_modules
npm install
```

### OpenAI API Errors
```bash
# Verify API key in .env
type backend\.env | findstr OPENAI

# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-your-key"
```

### Database Connection Failed
```bash
# Start MongoDB
mongod

# Or use Atlas connection string
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/
```

## 🎯 Keyboard Shortcuts

### Code Editor
- `Ctrl+S` - Save snippet
- `Ctrl+A` - Select all
- `Tab` - Indent
- `Shift+Tab` - Outdent

### Browser
- `F12` - Open DevTools
- `Ctrl+Shift+Delete` - Clear cache
- `Ctrl+R` - Refresh page

## 📦 File Locations

### Important Backend Files
```
backend/
├── .env                    # Environment variables
├── app/__init__.py         # Main FastAPI app
├── app/routes/ai.py        # AI endpoints
└── app/utils/openai_helper.py  # OpenAI logic
```

### Important Frontend Files
```
frontend/
├── src/App.jsx             # Main app & routing
├── src/pages/Dashboard.jsx # Code editor & chat
└── src/utils/api.js        # API client
```

## 🔍 Useful MongoDB Queries

```javascript
// Connect to database
mongosh
use codementor_ai

// View all users
db.users.find().pretty()

// Count snippets
db.snippets.countDocuments()

// Find user's snippets
db.snippets.find({user_id: "user_id_here"})

// View recent chats
db.chat_history.find().sort({created_at: -1}).limit(5)

// Delete all data (careful!)
db.users.deleteMany({})
db.snippets.deleteMany({})
db.chat_history.deleteMany({})
```

## 📝 Default Credentials

**First User**:
- No default user - create via registration
- All users have equal access
- Admin features not implemented

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Change JWT_SECRET_KEY to strong random string
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Add real domain to CORS origins
- [ ] Set up environment variables on hosting platform
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally

### Recommended Hosting

**Backend**:
- Heroku
- Railway
- Render
- AWS/GCP/Azure

**Frontend**:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

**Database**:
- MongoDB Atlas (free tier available)

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Step-by-step setup |
| `FEATURES.md` | All features explained |
| `TROUBLESHOOTING.md` | Common issues |
| `PROJECT_STRUCTURE.md` | File organization |
| `PROJECT_SUMMARY.md` | What was built |
| `COMPLETION_CHECKLIST.md` | All requirements met |
| `QUICK_REFERENCE.md` | This file |

## 🎓 Learn More

### FastAPI
- Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/

### React
- Docs: https://react.dev/
- Learn: https://react.dev/learn

### MongoDB
- Docs: https://www.mongodb.com/docs/
- University: https://university.mongodb.com/

### OpenAI
- Docs: https://platform.openai.com/docs/
- API Reference: https://platform.openai.com/docs/api-reference

### TailwindCSS
- Docs: https://tailwindcss.com/docs
- Cheatsheet: https://nerdcave.com/tailwind-cheat-sheet

## 💬 Get Help

1. Check `TROUBLESHOOTING.md`
2. Read error messages carefully
3. Check browser console (F12)
4. Check backend terminal logs
5. Verify environment variables
6. Try clean reinstall

## ✅ Health Check

Verify everything is working:

```bash
# Backend health
curl http://localhost:8000/health

# Frontend accessible
curl http://localhost:3000

# API docs
# Visit: http://localhost:8000/docs

# MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

---

**Quick Tip**: Keep this file bookmarked for easy reference! 🔖
