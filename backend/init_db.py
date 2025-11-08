"""
Database initialization script for CodeMentor AI
Creates indexes and initial setup
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


async def init_database():
    """Initialize database with indexes and collections"""
    print("🔧 Initializing CodeMentor AI Database...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    print(f"📊 Database: {settings.DATABASE_NAME}")
    
    # Create indexes for users collection
    print("\n📝 Creating indexes for 'users' collection...")
    await db.users.create_index("email", unique=True)
    print("   ✅ Unique index on 'email'")
    
    # Create indexes for snippets collection
    print("\n📝 Creating indexes for 'snippets' collection...")
    await db.snippets.create_index([("user_id", 1), ("created_at", -1)])
    await db.snippets.create_index("tags")
    print("   ✅ Index on 'user_id' and 'created_at'")
    print("   ✅ Index on 'tags'")
    
    # Create indexes for chat_history collection
    print("\n📝 Creating indexes for 'chat_history' collection...")
    await db.chat_history.create_index([("user_id", 1), ("created_at", -1)])
    print("   ✅ Index on 'user_id' and 'created_at'")
    
    # List all collections
    print("\n📚 Collections in database:")
    collections = await db.list_collection_names()
    for col in collections:
        count = await db[col].count_documents({})
        print(f"   - {col}: {count} documents")
    
    if not collections:
        print("   (No collections yet - will be created on first use)")
    
    print("\n✅ Database initialization complete!")
    print("\n💡 Tips:")
    print("   - Collections will be created automatically when data is inserted")
    print("   - Indexes improve query performance")
    print("   - Run this script again if you need to recreate indexes")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(init_database())
