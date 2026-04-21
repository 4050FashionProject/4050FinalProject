from fastapi import APIRouter, Depends, HTTPException, Response

from app.database import get_users_collection
from app.models.post import ClosetRequest
from app.utils.auth import get_current_user

router = APIRouter(prefix="/closet")


@router.get("/{username}", status_code=200)
async def get_closet(username: str, response: Response):
    users = get_users_collection()
    doc = await users.find_one({"username": username}, {"closet": 1})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    closet = doc.get("closet", [])
    if not closet:
        # Mutate the response object to send 204 with no body — returning None from a
        # 200-default route wouldn't change the status code on its own.
        response.status_code = 204
        return None
    return {"closet": closet}


@router.post("/add", status_code=200)
async def add_to_closet(body: ClosetRequest, current_user: str = Depends(get_current_user)):
    users = get_users_collection()
    result = await users.update_one(
        {"username": current_user},
        {"$addToSet": {"closet": body.image_id}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=500, detail="Could not save to closet")
    return {"message": "Added to closet"}


@router.post("/remove", status_code=200)
async def remove_from_closet(body: ClosetRequest, current_user: str = Depends(get_current_user)):
    users = get_users_collection()
    result = await users.update_one(
        {"username": current_user},
        {"$pull": {"closet": body.image_id}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=500, detail="Could not remove from closet")
    return {"message": "Removed from closet"}
