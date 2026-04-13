import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/mydb")

client = AsyncIOMotorClient(MONGO_URL)
db = client["mydb"]


def get_users_collection():
    return db["users"]


def get_posts_collection():
    return db["posts"]
