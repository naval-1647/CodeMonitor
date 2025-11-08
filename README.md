# CodeMentor AI — Intelligent Coding Assistant

A full-stack AI-powered coding assistant that helps developers generate, debug, and understand code using OpenAI's GPT API.

## 🚀 Features

### Backend (FastAPI)
- ✅ JWT authentication (register/login)
- ✅ MongoDB storage with Motor (async driver)
- ✅ OpenAI GPT integration with 3 modes:
  - **Generate**: Create code from descriptions
  - **Debug**: Fix code issues and bugs
  - **Explain**: Understand what code does
- ✅ WebSocket streaming for real-time AI responses
- ✅ Per-user rate limiting (50 requests/hour)
- ✅ Code snippet management (CRUD operations)
- ✅ Chat history tracking
- ✅ Team collaboration mode (multi-user rooms)
- ✅ RESTful API with comprehensive documentation

### Frontend (React)
- ✅ Modern UI with TailwindCSS
- ✅ Dark/Light mode toggle
- ✅ Integrated code editor (React Ace)
- ✅ Real-time AI chat with WebSocket
- ✅ Syntax highlighting for code snippets
- ✅ Snippet management with search
- ✅ Team collaboration rooms
- ✅ Responsive design
- ✅ Markdown rendering for AI responses

## 🛠️ Tech Stack

### Backend
- FastAPI
- MongoDB (Motor)
- OpenAI API
- JWT (python-jose)
- WebSockets
- Pydantic

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- React Ace (code editor)
- React Markdown
- WebSocket API

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- OpenAI API key

## 🚀 Quick Start

### 1. Clone Repository

```bash
cd c:\Users\HP\Desktop\hii
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY and MONGODB_URL

# Run server
python -m app
```

Backend runs on `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URL` in `.env`

## 📁 Project Structure

```
hii/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # FastAPI app
│   │   ├── __main__.py          # Entry point
│   │   ├── config.py            # Settings
│   │   ├── dependencies.py      # Auth dependencies
│   │   ├── database/
│   │   │   ├── connection.py    # MongoDB connection
│   │   │   ├── schemas/         # Pydantic models
│   │   │   │   ├── user.py
│   │   │   │   ├── snippet.py
│   │   │   │   └── chat.py
│   │   │   └── repositories/    # Database operations
│   │   │       ├── user_repository.py
│   │   │       ├── snippet_repository.py
│   │   │       └── chat_repository.py
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.py          # Login/Register
│   │   │   ├── ai.py            # AI prompts
│   │   │   ├── snippets.py      # Snippet CRUD
│   │   │   └── websocket.py     # WebSocket endpoints
│   │   └── utils/               # Utilities
│   │       ├── auth.py          # JWT & hashing
│   │       ├── openai_helper.py # OpenAI integration
│   │       └── rate_limiter.py  # Rate limiting
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Snippets.jsx
    │   │   └── TeamMode.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── websocket.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### AI
- `POST /api/ai/prompt` - Generate AI response
- `GET /api/ai/history` - Get chat history
- `DELETE /api/ai/history/{id}` - Delete chat entry
- `GET /api/ai/rate-limit` - Check rate limit status

### Snippets
- `POST /api/snippets` - Create snippet
- `GET /api/snippets` - List snippets
- `GET /api/snippets/{id}` - Get snippet
- `PUT /api/snippets/{id}` - Update snippet
- `DELETE /api/snippets/{id}` - Delete snippet

### WebSocket
- `WS /ws/chat?token={jwt}` - Real-time AI chat
- `WS /ws/team/{room_id}?token={jwt}` - Team collaboration

## 🎯 Usage Guide

### 1. Register & Login
- Create account at `/register`
- Login at `/login`
- JWT token stored automatically

### 2. Dashboard - AI Code Assistant
- **Generate Mode**: Describe what you want, AI writes code
- **Debug Mode**: Paste buggy code, AI fixes it
- **Explain Mode**: Paste code, AI explains it
- Real-time streaming responses via WebSocket

### 3. Code Snippets
- Save code snippets with title, language, tags
- Search by title or tags
- Edit and delete snippets
- Copy to clipboard

### 4. Team Mode
- Create or join a room with unique ID
- Share room link with teammates
- Chat and collaborate in real-time
- Ask AI questions together
- See responses streamed to all members

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Bearer token validation
- CORS configuration
- Rate limiting per user
- Input validation with Pydantic

## ⚙️ Configuration

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=codementor_ai
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OPENAI_API_KEY=sk-your-openai-key
RATE_LIMIT_REQUESTS=50
RATE_LIMIT_WINDOW_MINUTES=60
```

### Frontend (optional .env)
```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## 📝 Development

### Backend Development
```bash
cd backend
python -m app
# Server auto-reloads on file changes
```

### Frontend Development
```bash
cd frontend
npm run dev
# Hot module replacement enabled
```

### Production Build

**Backend**:
```bash
# Use gunicorn or uvicorn workers
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend**:
```bash
cd frontend
npm run build
# Outputs to dist/ folder
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### OpenAI API Errors
- Verify API key in `.env`
- Check API quota/limits
- Ensure you have credits

### WebSocket Connection Failed
- Check backend is running
- Verify JWT token is valid
- Check CORS settings

### Frontend Build Errors
- Delete `node_modules` and reinstall: `npm install`
- Clear cache: `npm cache clean --force`

## 🌟 Features in Detail

### Rate Limiting
- 50 requests per user per 60 minutes
- Tracks requests in-memory (production: use Redis)
- Returns remaining requests in response
- 429 error when limit exceeded

### WebSocket Chat
- Persistent connection for streaming
- Token-based authentication
- Automatic reconnection handling
- Real-time message broadcasting

### Code Editor
- Syntax highlighting for multiple languages
- Auto-completion
- Line numbers and gutter
- Theme customization
- Full-screen mode

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📧 Support

For issues or questions, please check the documentation in the `backend/README.md` and `frontend/README.md` files.

---

**Built with ❤️ using FastAPI, React, and OpenAI**
