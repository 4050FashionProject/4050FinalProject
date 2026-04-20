import asyncio
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx
import pytest
from jose import jwt
from motor.motor_asyncio import AsyncIOMotorClient

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT))

from seed import POSTS, USERS  # noqa: E402

BASE_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/mydb")
SECRET_KEY = os.getenv("SECRET_KEY", "TEST_SECRET_KEY")
ALGORITHM = "HS256"


def _login_json(client: httpx.Client, username: str, password: str) -> str:
    r = client.post("/users/login", data={"username": username, "password": password})
    r.raise_for_status()
    return r.json()["access_token"]


async def _wipe():
    mongo = AsyncIOMotorClient(MONGO_URL)
    try:
        await mongo["mydb"]["users"].delete_many({})
        await mongo["mydb"]["posts"].delete_many({})
    finally:
        mongo.close()


@pytest.fixture(scope="session", autouse=True)
def reset_and_seed():
    asyncio.new_event_loop().run_until_complete(_wipe())

    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        for user in USERS:
            c.post("/users/signup", json=user)
        for post in POSTS:
            token = _login_json(c, post["creator"], "password123")
            c.post("/posts/", json=post, headers={"Authorization": f"Bearer {token}"})
        dn = _login_json(c, "deepnimma", "password123")
        for target in ("janedoe", "alex_style"):
            c.post(
                "/users/follow",
                json={"username": target},
                headers={"Authorization": f"Bearer {dn}"},
            )
        jane_posts = c.get("/posts/user/janedoe").json().get("image_ids", [])
        if jane_posts:
            c.post(
                "/closet/add",
                json={"image_id": jane_posts[0]},
                headers={"Authorization": f"Bearer {dn}"},
            )
    yield
    asyncio.new_event_loop().run_until_complete(_wipe())


@pytest.fixture
def client():
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        yield c


@pytest.fixture
def deepnimma_token(client):
    return _login_json(client, "deepnimma", "password123")


@pytest.fixture
def janedoe_token(client):
    return _login_json(client, "janedoe", "password123")


@pytest.fixture
def deepnimma_auth(deepnimma_token):
    return {"Authorization": f"Bearer {deepnimma_token}"}


@pytest.fixture
def janedoe_auth(janedoe_token):
    return {"Authorization": f"Bearer {janedoe_token}"}


@pytest.fixture
def expired_token():
    payload = {
        "sub": "deepnimma",
        "exp": datetime.now(timezone.utc) - timedelta(minutes=5),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@pytest.fixture
def deepnimma_post_id(client, deepnimma_auth):
    body = {
        "image": "fixture_image_data",
        "coordinates": [{"x": 10, "y": 15, "link": "https://example.com/item"}],
        "caption": "fixture post",
        "hashtags": ["#fixture"],
        "creator": "deepnimma",
    }
    r = client.post("/posts/", json=body, headers=deepnimma_auth)
    assert r.status_code == 200, r.text
    pid = r.json()["image_id"]
    yield pid
    client.post("/posts/delete", json={"image_id": pid}, headers=deepnimma_auth)
