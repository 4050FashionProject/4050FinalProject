# Fashion Social API Documentation

Base URL: `http://localhost:8000`

Interactive docs available at `http://localhost:8000/docs` (Swagger UI).

---

## Getting Started

```bash
# from the project root (where docker-compose.yml lives)
docker compose up --build

# seed test data (in another terminal)
uv run python seed.py

# to reset everything
docker compose down -v
docker compose up --build
```

### Test Accounts

All seed users have the password `password123`.

| Username     | Display Name  | Email                   |
|--------------|---------------|-------------------------|
| deepnimma    | Deepesh Nimma | deepnimma@uga.edu       |
| janedoe      | Jane Doe      | janedoe@gmail.com       |
| alex_style   | Alex Kim      | alex.kim@outlook.com    |

---

## Authentication

The API uses JWT bearer tokens. Most endpoints that create, modify, or delete data require authentication.

### Getting a Token

```bash
curl -X POST http://localhost:8000/users/login \
  -d "username=deepnimma&password=password123"
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### Using the Token

Pass the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/posts/
```

Tokens expire after 60 minutes.

---

## User Endpoints

### POST /users/signup

Create a new account.

```bash
curl -X POST http://localhost:8000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "display_name": "New User",
    "password": "mypassword",
    "email": "new@example.com"
  }'
```

| Status | Meaning                              |
|--------|--------------------------------------|
| 200    | User created                         |
| 400    | Missing info / duplicate username or email |
| 422    | Validation error (username format, password length, etc.) |

Username rules: 4–20 characters, letters and underscores only.

---

### POST /users/login

Get an access token.

```bash
curl -X POST http://localhost:8000/users/login \
  -d "username=deepnimma&password=password123"
```

Note: this uses form data (`application/x-www-form-urlencoded`), not JSON.

| Status | Meaning            |
|--------|--------------------|
| 200    | Returns access token |
| 401    | Invalid credentials  |

---

### POST /users/update

Update the authenticated user's profile. Requires auth.

```bash
curl -X POST http://localhost:8000/users/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"display_name": "Updated Name"}'
```

All fields are optional — include only what you want to change:

```json
{
  "display_name": "New Name",
  "email": "newemail@example.com",
  "password": "newpassword"
}
```

| Status | Meaning                    |
|--------|----------------------------|
| 200    | Profile updated            |
| 400    | No fields provided / duplicate email |
| 401    | Not authenticated          |

---

### GET /users/{username}

Get a user's public profile.

```bash
curl http://localhost:8000/users/deepnimma
```

Response:

```json
{
  "username": "deepnimma",
  "display_name": "Deepesh Nimma",
  "email": "deepnimma@uga.edu",
  "followed_users": ["janedoe", "alex_style"],
  "closet": ["<image_id>"]
}
```

---

### GET /users/search/?q={query}

Search users by username, display name, or email. Returns up to 10 matches.

```bash
curl "http://localhost:8000/users/search/?q=deep"
```

Response:

```json
{
  "results": [
    {
      "username": "deepnimma",
      "display_name": "Deepesh Nimma",
      "email": "deepnimma@uga.edu",
      "followed_users": [],
      "closet": []
    }
  ]
}
```

---

### POST /users/follow

Follow a user. Requires auth.

```bash
curl -X POST http://localhost:8000/users/follow \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"username": "janedoe"}'
```

---

### POST /users/unfollow

Unfollow a user. Requires auth.

```bash
curl -X POST http://localhost:8000/users/unfollow \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"username": "janedoe"}'
```

---

### GET /users/{username}/following

Get the list of users someone follows.

```bash
curl http://localhost:8000/users/deepnimma/following
```

Response:

```json
{
  "followed_users": ["janedoe", "alex_style"]
}
```

---

## Post Endpoints

### GET /posts/

Get all post image IDs.

```bash
curl http://localhost:8000/posts/
```

Response:

```json
{
  "image_ids": ["550e8400-e29b-41d4-a716-446655440000", "..."]
}
```

---

### GET /posts/user/{username}

Get all post IDs by a specific user.

```bash
curl http://localhost:8000/posts/user/deepnimma
```

---

### POST /posts/

Create a new post. Requires auth. The `creator` field must match the authenticated user.

```bash
curl -X POST http://localhost:8000/posts/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "<base64 image string>",
    "coordinates": [
      {"x": 20, "y": 25, "link": "https://amazon.com/jacket"},
      {"x": 55, "y": 60, "link": "https://nike.com/shoes"}
    ],
    "caption": "New fit today",
    "hashtags": ["#ootd", "#streetwear"],
    "creator": "deepnimma"
  }'
```

Response:

```json
{
  "message": "Post successfully created",
  "image_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### POST /posts/delete

Delete a post. Requires auth. Only the original poster can delete.

```bash
curl -X POST http://localhost:8000/posts/delete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"image_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

| Status | Meaning                        |
|--------|--------------------------------|
| 200    | Post deleted                   |
| 400    | Post not found / not the owner |

---

### POST /posts/update

Update a post's coordinates, hashtags, or caption. Requires auth. Only the original poster can update.

```bash
curl -X POST http://localhost:8000/posts/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "550e8400-e29b-41d4-a716-446655440000",
    "caption": "Updated caption",
    "hashtags": ["#updated", "#newtags"]
  }'
```

Include only the fields you want to change. At least one of `coordinates`, `hashtags`, or `caption` is required.

---

## Closet Endpoints

### GET /closet/{username}

Get the image IDs saved in a user's closet.

```bash
curl http://localhost:8000/closet/deepnimma
```

| Status | Meaning       |
|--------|---------------|
| 200    | List of IDs   |
| 204    | Closet is empty |

---

### POST /closet/add

Save a post to your closet. Requires auth.

```bash
curl -X POST http://localhost:8000/closet/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"image_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

---

### POST /closet/remove

Remove a post from your closet. Requires auth.

```bash
curl -X POST http://localhost:8000/closet/remove \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"image_id": "550e8400-e29b-41d4-a716-446655440000"}'
```

---

## Inspecting the Database via the API

Quick scripts to dump what's currently stored. Run these while `docker compose up` is running.

### See all users

```bash
for user in deepnimma janedoe alex_style; do
  echo "=== $user ==="
  curl -s http://localhost:8000/users/$user | python3 -m json.tool
done
```

### See who a user follows

```bash
curl -s http://localhost:8000/users/deepnimma/following | python3 -m json.tool
```

### See all post IDs

```bash
curl -s http://localhost:8000/posts/ | python3 -m json.tool
```

### See all posts by a user

```bash
curl -s http://localhost:8000/posts/user/deepnimma | python3 -m json.tool
```

### See a user's closet

```bash
curl -s http://localhost:8000/closet/deepnimma
```

### Search for a user

```bash
curl -s "http://localhost:8000/users/search/?q=deep" | python3 -m json.tool
```

### Dump everything at once

```bash
echo "--- ALL POSTS ---"
curl -s http://localhost:8000/posts/ | python3 -m json.tool

for user in deepnimma janedoe alex_style; do
  echo ""
  echo "--- USER: $user ---"
  curl -s http://localhost:8000/users/$user | python3 -m json.tool
  echo "  posts:"
  curl -s http://localhost:8000/posts/user/$user | python3 -m json.tool
  echo "  closet:"
  curl -s http://localhost:8000/closet/$user
  echo ""
done
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Description of what went wrong"
}
```

Common status codes across all endpoints:

| Status | Meaning                    |
|--------|----------------------------|
| 200    | Success                    |
| 204    | Success, no content        |
| 400    | Bad request / missing data |
| 401    | Not authenticated / bad token |
| 422    | Validation error (Pydantic) |
| 500    | Internal server error      |