import re

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.database import get_users_collection
from app.models.user import FollowRequest, UserResponse, UserSignup, UserUpdate
from app.utils.auth import create_access_token, get_current_user, hash_password, verify_password
from app.utils.validators import user_doc_to_response

# /search/ must be registered before /{username} — FastAPI matches routes in order,
# and a literal path like /search/ would otherwise be caught by the username param.
router = APIRouter(prefix="/users")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/signup", status_code=200)
async def signup(body: UserSignup):
    users = get_users_collection()

    if await users.find_one({"username": body.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if await users.find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    await users.insert_one({
        "username": body.username,
        "display_name": body.display_name,
        "password": hash_password(body.password),
        "email": body.email,
        "followed_users": [],
        "closet": [],
    })
    return {"message": "User successfully created"}


@router.post("/login", status_code=200)
async def login(body: LoginRequest):
    users = get_users_collection()
    doc = await users.find_one({"username": body.username})
    if not doc or not verify_password(body.password, doc["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": doc["username"]})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/update", status_code=200)
async def update_profile(body: UserUpdate, current_user: str = Depends(get_current_user)):
    # exclude_none=True so only fields the caller set are included in the $set payload
    updates = body.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided")

    if "password" in updates:
        updates["password"] = hash_password(updates["password"])

    if "email" in updates:
        users = get_users_collection()
        if await users.find_one({"email": updates["email"], "username": {"$ne": current_user}}):
            raise HTTPException(status_code=400, detail="Email already exists")

    users = get_users_collection()
    await users.update_one({"username": current_user}, {"$set": updates})
    return {"message": "Profile updated"}


@router.get("/search/", status_code=200)
async def search_users(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter q is required")

    # re.escape prevents user input from being interpreted as a regex pattern (injection)
    pattern = {"$regex": re.escape(q), "$options": "i"}
    users = get_users_collection()
    cursor = users.find(
        {"$or": [{"username": pattern}, {"display_name": pattern}, {"email": pattern}]},
        limit=10,
    )
    results = [user_doc_to_response(doc) async for doc in cursor]
    return {"results": results}


@router.get("/{username}", response_model=UserResponse)
async def get_user(username: str):
    users = get_users_collection()
    doc = await users.find_one({"username": username})
    if not doc:
        raise HTTPException(status_code=400, detail="User not found")
    return user_doc_to_response(doc)


@router.post("/follow", status_code=200)
async def follow_user(body: FollowRequest, current_user: str = Depends(get_current_user)):
    if body.username == current_user:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    users = get_users_collection()
    if not await users.find_one({"username": body.username}):
        raise HTTPException(status_code=400, detail="User not found")
    # $addToSet is idempotent — following an already-followed user is a no-op
    await users.update_one({"username": current_user}, {"$addToSet": {"followed_users": body.username}})
    return {"message": "Followed successfully"}


@router.post("/unfollow", status_code=200)
async def unfollow_user(body: FollowRequest, current_user: str = Depends(get_current_user)):
    users = get_users_collection()
    await users.update_one({"username": current_user}, {"$pull": {"followed_users": body.username}})
    return {"message": "Unfollowed successfully"}


@router.get("/{username}/following", status_code=200)
async def get_following(username: str):
    users = get_users_collection()
    doc = await users.find_one({"username": username}, {"followed_users": 1})
    if not doc:
        raise HTTPException(status_code=400, detail="User not found")
    return {"followed_users": doc.get("followed_users", [])}
