"""
Populates backend with test data.
"""
import httpx

BASE_URL = "http://localhost:8000"

USERS = [
    {"username": "deepnimma", "display_name": "Deepesh Nimma", "password": "password123", "email": "deepnimma@uga.edu"},
    {"username": "janedoe", "display_name": "Jane Doe", "password": "password123", "email": "janedoe@gmail.com"},
    {"username": "alex_style", "display_name": "Alex Kim", "password": "password123", "email": "alex.kim@outlook.com"},
]

POSTS = [
    {
        "image": "base64imagedata1",
        "coordinates": [{"x": 20, "y": 25, "link": "https://amazon.com/jacket"}],
        "caption": "New fit today",
        "hashtags": ["#ootd", "#streetwear"],
        "creator": "deepnimma",
    },
    {
        "image": "base64imagedata2",
        "coordinates": [{"x": 55, "y": 60, "link": "https://nike.com/shoes"}],
        "caption": "Fresh kicks",
        "hashtags": ["#sneakers", "#nike"],
        "creator": "janedoe",
    },
    {
        "image": "base64imagedata3",
        "coordinates": [{"x": 30, "y": 40, "link": "https://zara.com/coat"}],
        "caption": "Fall vibes",
        "hashtags": ["#fall", "#fashion"],
        "creator": "alex_style",
    },
]


def get_token(client: httpx.Client, username: str, password: str) -> str:
    response = client.post("/users/login", data={"username": username, "password": password})
    response.raise_for_status()
    return response.json()["access_token"]


def main():
    with httpx.Client(base_url=BASE_URL) as client:
        for user in USERS:
            response = client.post("/users/signup", json=user)
            if response.status_code == 200:
                print(f"Created user: {user['username']}")
            elif response.status_code == 400:
                print(f"User already exists: {user['username']}")
            else:
                print(f"Failed to create user {user['username']}: {response.text}")

        for post in POSTS:
            token = get_token(client, post["creator"], "password123")
            response = client.post(
                "/posts/",
                json=post,
                headers={"Authorization": f"Bearer {token}"},
            )
            if response.status_code == 200:
                print(f"Created post by {post['creator']}: {response.json()['image_id']}")
            else:
                print(f"Failed to create post by {post['creator']}: {response.text}")

        deepnimma_token = get_token(client, "deepnimma", "password123")
        for target in ["janedoe", "alex_style"]:
            response = client.post(
                "/users/follow",
                json={"username": target},
                headers={"Authorization": f"Bearer {deepnimma_token}"},
            )
            if response.status_code == 200:
                print(f"deepnimma followed {target}")


if __name__ == "__main__":
    main()
