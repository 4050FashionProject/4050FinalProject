from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import closet, posts, users

app = FastAPI(title="Fashion Social API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(posts.router)
app.include_router(closet.router)
