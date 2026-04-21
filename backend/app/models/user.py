from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserSignup(BaseModel):
    username: str = Field(min_length=4, max_length=20, pattern=r"^[a-zA-Z_]+(_\d+)?$")
    display_name: str = Field(max_length=50)
    password: str = Field(min_length=8)
    email: EmailStr


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8)


class UserResponse(BaseModel):
    username: str
    display_name: str
    email: str
    followed_users: list[str] = []
    closet: list[str] = []


class FollowRequest(BaseModel):
    username: str
