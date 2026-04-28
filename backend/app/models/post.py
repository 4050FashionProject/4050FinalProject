from typing import Optional
from pydantic import BaseModel, model_validator


class Coordinate(BaseModel):
    x: float
    y: float
    link: str
    name: str


class PostCreate(BaseModel):
    image: str
    coordinates: list[Coordinate]
    caption: str
    hashtags: list[str]
    creator: str


class PostUpdate(BaseModel):
    image_id: str
    coordinates: Optional[list[Coordinate]] = None
    hashtags: Optional[list[str]] = None
    caption: Optional[str] = None

    # mode="after" runs once all individual fields have been validated and the model
    # instance is fully assembled, so we can inspect the final field values together.
    @model_validator(mode="after")
    def at_least_one_field(self):
        if self.coordinates is None and self.hashtags is None and self.caption is None:
            raise ValueError("At least one of coordinates, hashtags, or caption must be provided")
        return self


class PostDelete(BaseModel):
    image_id: str


class ClosetRequest(BaseModel):
    image_id: str
