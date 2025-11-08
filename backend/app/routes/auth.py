from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from app.database.schemas import UserCreate, UserLogin, UserResponse
from app.database.repositories import UserRepository
from app.utils.auth import verify_password, get_password_hash, create_access_token
from app.config import settings
from app.dependencies import get_current_user
from app.database.schemas.user import UserInDB

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    if await UserRepository.user_exists(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user_dict = {
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed_password,
    }
    
    user = await UserRepository.create_user(user_dict)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "status": "success",
        "message": "User registered successfully",
        "data": {
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    }


@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login user"""
    # Get user
    user = await UserRepository.get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    }


@router.get("/me", response_model=dict)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    """Get current user info"""
    return {
        "status": "success",
        "message": "User retrieved successfully",
        "data": {
            "id": str(current_user.id),
            "username": current_user.username,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat()
        }
    }
