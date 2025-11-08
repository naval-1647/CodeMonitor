from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.routes import auth_router, snippets_router, ai_router, websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="CodeMentor AI",
    description="Intelligent Coding Assistant with AI-powered code generation, debugging, and explanation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(snippets_router)
app.include_router(ai_router)
app.include_router(websocket_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to CodeMentor AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
