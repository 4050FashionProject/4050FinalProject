import pytest


def test_4_1_2_1_signup_with_valid_fields(client):
    body = {
        "username": "testuser_01",
        "display_name": "Test User",
        "password": "SecurePass123",
        "email": "testuser01@example.com",
    }
    r = client.post("/users/signup", json=body)
    assert r.status_code == 200
    assert "message" in r.json()

    login = client.post(
        "/users/login",
        data={"username": "testuser_01", "password": "SecurePass123"},
    )
    assert login.status_code == 200


def test_4_1_2_2_signup_duplicate_username(client):
    body = {
        "username": "deepnimma",
        "display_name": "someone else",
        "password": "anotherpassword",
        "email": "someoneelse@example.com",
    }
    r = client.post("/users/signup", json=body)
    assert r.status_code == 400
    assert "username" in r.json()["detail"].lower()


@pytest.mark.parametrize(
    "username",
    ["ab", "user123", "has space", "has@symbol"],
)
def test_4_1_2_3_signup_invalid_username(client, username):
    body = {
        "username": username,
        "display_name": "Valid Name",
        "password": "ValidPass123",
        "email": f"unique_{abs(hash(username))}@example.com",
    }
    r = client.post("/users/signup", json=body)
    assert r.status_code == 422
    errors = r.json()["detail"]
    assert any("username" in str(e.get("loc", [])) for e in errors)


def test_4_1_2_4_signup_duplicate_email(client):
    body = {
        "username": "newuser_unique",
        "display_name": "Another User",
        "password": "SomePass123",
        "email": "deepnimma@uga.edu",
    }
    r = client.post("/users/signup", json=body)
    assert r.status_code == 400
    assert "email" in r.json()["detail"].lower()


@pytest.mark.parametrize(
    "missing",
    ["username", "display_name", "password", "email"],
)
def test_4_1_2_5_signup_missing_required_field(client, missing):
    body = {
        "username": "validname",
        "display_name": "Valid Name",
        "password": "ValidPass123",
        "email": "missingfield@example.com",
    }
    body.pop(missing)
    r = client.post("/users/signup", json=body)
    assert r.status_code == 422
    errors = r.json()["detail"]
    assert any(missing in str(e.get("loc", [])) for e in errors)
