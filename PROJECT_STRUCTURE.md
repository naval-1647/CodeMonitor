# 📁 CodeMentor AI - Complete Project Structure

```
hii/
│
├── 📄 README.md                    # Main project documentation
├── 📄 SETUP_GUIDE.md              # Step-by-step setup instructions
├── 📄 FEATURES.md                 # Comprehensive features documentation
├── 📄 PROJECT_SUMMARY.md          # What has been built
├── 📄 TROUBLESHOOTING.md          # Common issues and solutions
│
├── 🚀 install.bat                 # Automated dependency installation
├── 🚀 start-all.bat               # Start both backend and frontend
├── 🚀 start-backend.bat           # Start backend only
├── 🚀 start-frontend.bat          # Start frontend only
│
├── 📁 backend/                    # FastAPI Backend
│   │
│   ├── 📁 app/                    # Main application package
│   │   │
│   │   ├── 📄 __init__.py         # FastAPI app initialization & routes
│   │   ├── 📄 __main__.py         # Entry point (uvicorn server)
│   │   ├── 📄 config.py           # Settings & environment variables
│   │   ├── 📄 dependencies.py     # Auth dependencies & middleware
│   │   │
│   │   ├── 📁 database/           # Database layer
│   │   │   │
│   │   │   ├── 📄 connection.py   # MongoDB connection management
│   │   │   │
│   │   │   ├── 📁 schemas/        # Pydantic models
│   │   │   │   ├── 📄 __init__.py
│   │   │   │   ├── 📄 user.py     # User models (Create, Login, Response)
│   │   │   │   ├── 📄 snippet.py  # Snippet models (CRUD)
│   │   │   │   └── 📄 chat.py     # Chat history models
│   │   │   │
│   │   │   └── 📁 repositories/   # Database operations
│   │   │       ├── 📄 __init__.py
│   │   │       ├── 📄 user_repository.py      # User CRUD
│   │   │       ├── 📄 snippet_repository.py   # Snippet CRUD
│   │   │       └── 📄 chat_repository.py      # Chat history CRUD
│   │   │
│   │   ├── 📁 routes/             # API endpoints
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 auth.py         # /api/auth/* (register, login)
│   │   │   ├── 📄 ai.py           # /api/ai/* (prompt, history)
│   │   │   ├── 📄 snippets.py     # /api/snippets/* (CRUD)
│   │   │   └── 📄 websocket.py    # /ws/* (chat, team)
│   │   │
│   │   └── 📁 utils/              # Utility functions
│   │       ├── 📄 __init__.py
│   │       ├── 📄 auth.py         # JWT & password hashing
│   │       ├── 📄 openai_helper.py # OpenAI API integration
│   │       └── 📄 rate_limiter.py  # Rate limiting logic
│   │
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 .env                    # Environment variables (SECRET!)
│   ├── 📄 .env.example            # Example environment file
│   ├── 📄 .gitignore              # Git ignore rules
│   ├── 📄 init_db.py              # Database initialization script
│   └── 📄 README.md               # Backend documentation
│
└── 📁 frontend/                   # React Frontend
    │
    ├── 📄 index.html              # HTML entry point
    ├── 📄 package.json            # Node.js dependencies & scripts
    ├── 📄 vite.config.js          # Vite configuration
    ├── 📄 tailwind.config.js      # TailwindCSS configuration
    ├── 📄 postcss.config.js       # PostCSS configuration
    ├── 📄 .gitignore              # Git ignore rules
    ├── 📄 README.md               # Frontend documentation
    │
    └── 📁 src/                    # Source code
        │
        ├── 📄 main.jsx            # React entry point
        ├── 📄 App.jsx             # Main app component (routing)
        ├── 📄 index.css           # Global styles (Tailwind)
        │
        ├── 📁 components/         # Reusable components
        │   ├── 📄 Navbar.jsx      # Navigation bar
        │   └── 📄 PrivateRoute.jsx # Protected route wrapper
        │
        ├── 📁 context/            # React Context providers
        │   ├── 📄 AuthContext.jsx  # Authentication state
        │   └── 📄 ThemeContext.jsx # Dark/Light theme state
        │
        ├── 📁 pages/              # Page components
        │   ├── 📄 Login.jsx        # Login page
        │   ├── 📄 Register.jsx     # Registration page
        │   ├── 📄 Dashboard.jsx    # Main dashboard (editor + chat)
        │   ├── 📄 Snippets.jsx     # Code snippets library
        │   └── 📄 TeamMode.jsx     # Team collaboration
        │
        └── 📁 utils/              # Utility functions
            ├── 📄 api.js           # Axios instance & interceptors
            └── 📄 websocket.js     # WebSocket client wrapper
```

## 📊 File Count Summary

| Category | Files | Description |
|----------|-------|-------------|
| **Backend Core** | 4 | App initialization, config, dependencies |
| **Database** | 8 | Connection, schemas, repositories |
| **API Routes** | 5 | REST endpoints & WebSocket |
| **Utils** | 4 | Auth, OpenAI, rate limiting |
| **Backend Config** | 4 | Requirements, env, gitignore, docs |
| **Frontend Core** | 3 | Entry points & global styles |
| **Components** | 2 | Navbar, PrivateRoute |
| **Context** | 2 | Auth, Theme providers |
| **Pages** | 5 | Login, Register, Dashboard, Snippets, Team |
| **Frontend Utils** | 2 | API client, WebSocket client |
| **Frontend Config** | 6 | Package.json, Vite, Tailwind, etc. |
| **Documentation** | 8 | READMEs, guides, summaries |
| **Scripts** | 5 | Install & start scripts |
| **TOTAL** | **58 files** | Complete full-stack application |

## 🎯 Key Files Explained

### Backend Critical Files

**`app/__init__.py`**
- Creates FastAPI application
- Configures CORS
- Includes all routers
- Manages database lifecycle

**`app/config.py`**
- Loads environment variables
- Provides settings to entire app
- Uses Pydantic for validation

**`app/routes/auth.py`**
- `/api/auth/register` - Create new user
- `/api/auth/login` - Authenticate user
- `/api/auth/me` - Get current user

**`app/routes/ai.py`**
- `/api/ai/prompt` - Send AI request
- `/api/ai/history` - Get chat history
- Rate limiting applied

**`app/routes/websocket.py`**
- `/ws/chat` - Real-time AI chat
- `/ws/team/{room_id}` - Team collaboration

**`app/utils/openai_helper.py`**
- Integrates with OpenAI API
- Implements 3 modes (generate, debug, explain)
- Handles streaming responses

### Frontend Critical Files

**`src/App.jsx`**
- Main routing component
- Wraps with AuthProvider and ThemeProvider
- Defines all routes

**`src/context/AuthContext.jsx`**
- Global authentication state
- Login/logout functions
- Token management

**`src/pages/Dashboard.jsx`**
- Code editor (React Ace)
- AI chat interface
- WebSocket integration
- Most complex component

**`src/utils/api.js`**
- Axios instance
- Request/response interceptors
- Automatic token attachment
- Error handling

**`src/utils/websocket.js`**
- WebSocket client wrapper
- Message handling
- Connection management

## 🔄 Data Flow

### Authentication Flow
```
User -> Login.jsx -> api.js -> /api/auth/login -> auth.py
  -> UserRepository -> MongoDB -> JWT Token -> localStorage
  -> AuthContext -> Dashboard.jsx
```

### AI Request Flow
```
User types prompt -> Dashboard.jsx -> WebSocket -> websocket.py
  -> openai_helper.py -> OpenAI API -> Streaming response
  -> WebSocket -> Dashboard.jsx -> Display tokens
  -> Save to ChatRepository -> MongoDB
```

### Snippet Save Flow
```
Code in editor -> Save button -> Dashboard.jsx -> api.js
  -> /api/snippets -> snippets.py -> SnippetRepository
  -> MongoDB -> Success response -> Snippets.jsx
```

## 🏗️ Architecture Patterns

### Backend
- **Repository Pattern**: Database abstraction
- **Dependency Injection**: FastAPI DI system
- **Layered Architecture**: Routes → Logic → Database
- **Schema Validation**: Pydantic models

### Frontend
- **Component-Based**: Reusable React components
- **Context Pattern**: Global state management
- **Custom Hooks**: useAuth, useTheme
- **Centralized API**: Single axios instance

## 🔐 Security Layers

1. **Password Security**: Bcrypt hashing
2. **Token Security**: JWT with expiration
3. **Route Protection**: Middleware on backend, PrivateRoute on frontend
4. **Input Validation**: Pydantic schemas
5. **Rate Limiting**: Per-user request limits
6. **CORS**: Restricted origins

## 🚀 Entry Points

### Start Backend
```
start-backend.bat → python -m app → app/__main__.py
  → app/__init__.py (creates FastAPI app)
  → uvicorn runs on port 8000
```

### Start Frontend
```
start-frontend.bat → npm run dev → vite.config.js
  → index.html → src/main.jsx → src/App.jsx
  → React app on port 3000
```

## 📦 Dependencies Map

### Backend Dependencies Tree
```
fastapi
  ├── pydantic (validation)
  ├── uvicorn (server)
  └── python-multipart (file uploads)

motor
  └── pymongo (MongoDB driver)

openai
  └── httpx (HTTP client)

python-jose
  └── cryptography (JWT)

passlib
  └── bcrypt (password hashing)
```

### Frontend Dependencies Tree
```
react
  ├── react-dom
  └── react-router-dom

vite
  ├── @vitejs/plugin-react
  └── esbuild

tailwindcss
  ├── autoprefixer
  └── postcss

axios (HTTP client)

react-ace (code editor)
  └── ace-builds

react-markdown
  └── react-syntax-highlighter
```

## 🎨 Styling Architecture

```
index.css (Global Tailwind)
  ├── @tailwind base
  ├── @tailwind components (btn, input, card classes)
  └── @tailwind utilities

tailwind.config.js (Configuration)
  ├── Colors (primary palette)
  ├── Dark mode (class-based)
  └── Content paths

Components use Tailwind classes directly
  - No CSS modules
  - No styled-components
  - Utility-first approach
```

## 🗄️ Database Schema

```
MongoDB (codementor_ai)
  │
  ├── users
  │     ├── _id: ObjectId
  │     ├── username: string
  │     ├── email: string (unique index)
  │     ├── hashed_password: string
  │     ├── created_at: datetime
  │     └── is_active: boolean
  │
  ├── snippets
  │     ├── _id: ObjectId
  │     ├── user_id: string (index)
  │     ├── title: string
  │     ├── code: string
  │     ├── language: string
  │     ├── description: string
  │     ├── tags: array
  │     ├── created_at: datetime (index)
  │     └── updated_at: datetime
  │
  └── chat_history
        ├── _id: ObjectId
        ├── user_id: string (index)
        ├── messages: array
        │     ├── role: string
        │     ├── content: string
        │     └── timestamp: datetime
        ├── mode: string
        ├── code_context: string
        └── created_at: datetime (index)
```

---

This structure represents a **production-ready, enterprise-grade** full-stack application! 🚀
