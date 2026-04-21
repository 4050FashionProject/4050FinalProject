import pytest


@pytest.fixture
def unfollow_targets(client, deepnimma_auth):
    yield
    for target in ("janedoe", "alex_style"):
        client.post("/users/follow", json={"username": target}, headers=deepnimma_auth)


def test_4_2_2_1_follow_user(client, deepnimma_auth):
    client.post("/users/unfollow", json={"username": "janedoe"}, headers=deepnimma_auth)

    r = client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)
    assert r.status_code == 200

    get_r = client.get("/users/deepnimma/following")
    assert get_r.status_code == 200
    assert "janedoe" in get_r.json()["followed_users"]


def test_4_2_2_2_follow_nonexistent_user(client, deepnimma_auth):
    r = client.post(
        "/users/follow",
        json={"username": "ghost_user_zzz"},
        headers=deepnimma_auth,
    )
    assert r.status_code == 400

    get_r = client.get("/users/deepnimma/following")
    assert "ghost_user_zzz" not in get_r.json()["followed_users"]


def test_4_2_2_3_follow_self(client, deepnimma_auth):
    r = client.post("/users/follow", json={"username": "deepnimma"}, headers=deepnimma_auth)
    assert r.status_code == 400

    get_r = client.get("/users/deepnimma/following")
    assert "deepnimma" not in get_r.json()["followed_users"]


def test_4_2_2_4_follow_without_token(client):
    r = client.post("/users/follow", json={"username": "janedoe"})
    assert r.status_code == 401


def test_4_2_2_5_follow_idempotent(client, deepnimma_auth):
    client.post("/users/unfollow", json={"username": "janedoe"}, headers=deepnimma_auth)

    r1 = client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)
    r2 = client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)
    assert r1.status_code == 200
    assert r2.status_code == 200

    get_r = client.get("/users/deepnimma/following")
    followed = get_r.json()["followed_users"]
    assert followed.count("janedoe") == 1


def test_4_2_3_1_unfollow_user(client, deepnimma_auth):
    client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)

    r = client.post("/users/unfollow", json={"username": "janedoe"}, headers=deepnimma_auth)
    assert r.status_code == 200

    get_r = client.get("/users/deepnimma/following")
    assert "janedoe" not in get_r.json()["followed_users"]

    client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)


def test_4_2_3_2_unfollow_without_token(client):
    r = client.post("/users/unfollow", json={"username": "janedoe"})
    assert r.status_code == 401


def test_4_2_4_1_get_followed_list(client, deepnimma_auth):
    client.post("/users/follow", json={"username": "janedoe"}, headers=deepnimma_auth)
    client.post("/users/follow", json={"username": "alex_style"}, headers=deepnimma_auth)

    r = client.get("/users/deepnimma/following")
    assert r.status_code == 200
    followed = r.json()["followed_users"]
    assert set(followed) >= {"janedoe", "alex_style"}


def test_4_2_4_2_get_followed_list_nonexistent(client):
    r = client.get("/users/ghost_user_zzz/following")
    assert r.status_code == 404
