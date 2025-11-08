from datetime import datetime, timedelta
from typing import Dict
from app.config import settings


class RateLimiter:
    """Simple in-memory rate limiter using timestamps"""
    
    def __init__(self):
        self.requests: Dict[str, list] = {}
    
    def is_allowed(self, user_id: str) -> bool:
        """Check if user is allowed to make a request"""
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=settings.RATE_LIMIT_WINDOW_MINUTES)
        
        # Get user's request history
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Remove old requests outside the window
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if req_time > window_start
        ]
        
        # Check if user has exceeded the limit
        if len(self.requests[user_id]) >= settings.RATE_LIMIT_REQUESTS:
            return False
        
        # Add current request
        self.requests[user_id].append(now)
        return True
    
    def get_remaining_requests(self, user_id: str) -> int:
        """Get number of remaining requests for user"""
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=settings.RATE_LIMIT_WINDOW_MINUTES)
        
        if user_id not in self.requests:
            return settings.RATE_LIMIT_REQUESTS
        
        # Count requests in current window
        recent_requests = [
            req_time for req_time in self.requests[user_id]
            if req_time > window_start
        ]
        
        return max(0, settings.RATE_LIMIT_REQUESTS - len(recent_requests))


# Global rate limiter instance
rate_limiter = RateLimiter()
