import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_posts_collection, get_users_collection
from app.models.post import PostCreate, PostDelete, PostUpdate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/posts")


@router.get("/", status_code=200)
async def get_all_posts():
    posts = get_posts_collection()
    image_ids = [doc["image_id"] async for doc in posts.find({}, {"image_id": 1})]
    return {"image_ids": image_ids}


@router.get("/user/{username}", status_code=200)
async def get_user_posts(username: str):
    users = get_users_collection()
    if not await users.find_one({"username": username}, {"_id": 1}):
        raise HTTPException(status_code=404, detail="User not found")
    posts = get_posts_collection()
    image_ids = [doc["image_id"] async for doc in posts.find({"creator": username}, {"image_id": 1})]
    return {"image_ids": image_ids}


@router.post("/", status_code=200)
async def create_post(body: PostCreate, current_user: str = Depends(get_current_user)):
    if body.creator != current_user:
        raise HTTPException(status_code=400, detail="Creator must match authenticated user")

    image_id = str(uuid.uuid4())
    posts = get_posts_collection()
    await posts.insert_one({
        "image_id": image_id,
        "image": body.image,
        "coordinates": [c.model_dump() for c in body.coordinates],
        "caption": body.caption,
        "hashtags": body.hashtags,
        "creator": body.creator,
    })
    return {"message": "Post successfully created", "image_id": image_id}


@router.post("/delete", status_code=200)
async def delete_post(body: PostDelete, current_user: str = Depends(get_current_user)):
    posts = get_posts_collection()
    doc = await posts.find_one({"image_id": body.image_id})
    if not doc:
        raise HTTPException(status_code=400, detail="Post not found")
    if doc["creator"] != current_user:
        raise HTTPException(status_code=400, detail="Not the original poster")
    await posts.delete_one({"image_id": body.image_id})
    return {"message": "Post deleted"}


@router.post("/update", status_code=200)
async def update_post(body: PostUpdate, current_user: str = Depends(get_current_user)):
    posts = get_posts_collection()
    doc = await posts.find_one({"image_id": body.image_id})
    if not doc:
        raise HTTPException(status_code=400, detail="Post not found")
    if doc["creator"] != current_user:
        raise HTTPException(status_code=400, detail="Not the original poster")

    updates = {}
    if body.caption is not None:
        updates["caption"] = body.caption
    if body.hashtags is not None:
        updates["hashtags"] = body.hashtags
    if body.coordinates is not None:
        updates["coordinates"] = [c.model_dump() for c in body.coordinates]

    await posts.update_one({"image_id": body.image_id}, {"$set": updates})
    return {"message": "Post updated"}
