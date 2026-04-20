import pytest
from jose import jwt

from tests.conftest import ALGORITHM, SECRET_KEY


def test_4_1_5_1_login_valid_credentials(client):
    r = client.post(
        "/users/login",
        data={"username": "deepnimma", "password": "password123"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["token_type"] == "bearer"
    token = body["access_token"]
    assert isinstance(token, str) and token

    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "deepnimma"
    assert "exp" in decoded


@pytest.mark.parametrize(
    "username,password",
    [("deepnimma", "wrongpassword"), ("does_not_exist", "anything")],
)
def test_4_1_5_2_login_invalid_credentials(client, username, password):
    r = client.post("/users/login", data={"username": username, "password": password})
    assert r.status_code == 401
    assert "access_token" not in r.json()
