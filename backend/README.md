# CodeMentor AI - Backend

Intelligent Coding Assistant API built with FastAPI, MongoDB, and OpenAI.

## Features

- 🔐 JWT Authentication (Register/Login)
- 🤖 AI-powered code generation, debugging, and explanation
- 💾 MongoDB storage for users, snippets, and chat history
- 🚀 WebSocket support for real-time AI streaming responses
- 👥 Team Mode for collaborative AI chat sessions
- ⏱️ Per-user rate limiting
- 📝 Code snippet management with search

## Tech Stack

- **FastAPI** - Modern, fast web framework
- **Motor** - Async MongoDB driver
- **OpenAI API** - GPT-powered AI responses
- **JWT** - Token-based authentication
- **WebSockets** - Real-time communication

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=codementor_ai
JWT_SECRET_KEY=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Run MongoDB

Make sure MongoDB is running on `localhost:27017` or update the connection string.

### 4. Start Server

```bash
cd backend
python -m app
```

Server runs on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### AI
- `POST /api/ai/prompt` - Generate AI response (modes: generate, debug, explain)
- `GET /api/ai/history` - Get chat history
- `DELETE /api/ai/history/{chat_id}` - Delete chat history
- `GET /api/ai/rate-limit` - Get rate limit status

### Snippets
- `POST /api/snippets` - Create snippet
- `GET /api/snippets` - Get all snippets (with search)
- `GET /api/snippets/{id}` - Get snippet by ID
- `PUT /api/snippets/{id}` - Update snippet
- `DELETE /api/snippets/{id}` - Delete snippet

### WebSocket
- `WS /ws/chat?token=JWT_TOKEN` - Real-time AI chat streaming
- `WS /ws/team/{room_id}?token=JWT_TOKEN` - Team collaboration mode

## API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger documentation.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # FastAPI app initialization
│   ├── __main__.py          # Entry point
│   ├── config.py            # Settings and configuration
│   ├── dependencies.py      # Auth dependencies
│   ├── database/
│   │   ├── connection.py    # MongoDB connection
│   │   ├── schemas/         # Pydantic models
│   │   └── repositories/    # Database operations
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── ai.py
│   │   ├── snippets.py
│   │   └── websocket.py
│   └── utils/               # Utilities
│       ├── auth.py          # JWT & password hashing
│       ├── openai_helper.py # OpenAI integration
│       └── rate_limiter.py  # Rate limiting
├── requirements.txt
└── .env.example
```

## Rate Limiting

- 50 requests per user per 60-minute window
- Configurable via environment variables

## Security

- Passwords hashed with bcrypt
- JWT tokens with configurable expiration
- Bearer token authentication for protected routes
