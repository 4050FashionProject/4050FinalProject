def test_4_1_8_1_get_existing_profile(client):
    r = client.get("/users/deepnimma")
    assert r.status_code == 200
    body = r.json()
    assert body["username"] == "deepnimma"
    assert "display_name" in body
    assert "email" in body
    assert "followed_users" in body
    assert "closet" in body
    assert "password" not in body


def test_4_1_8_2_get_nonexistent_profile(client):
    r = client.get("/users/ghost_user_zzz")
    assert r.status_code == 404


def test_4_1_9_1_update_partial_field(client, deepnimma_auth):
    r = client.post("/users/update", json={"display_name": "Deep N."}, headers=deepnimma_auth)
    assert r.status_code == 200

    get_r = client.get("/users/deepnimma")
    assert get_r.status_code == 200
    body = get_r.json()
    assert body["display_name"] == "Deep N."
    assert body["username"] == "deepnimma"
    assert body["email"] == "deepnimma@uga.edu"

    client.post(
        "/users/update",
        json={"display_name": "Deepesh Nimma"},
        headers=deepnimma_auth,
    )


def test_4_1_9_2_update_no_fields(client, deepnimma_auth):
    r = client.post("/users/update", json={}, headers=deepnimma_auth)
    assert r.status_code == 400


def test_4_1_9_3_update_without_token(client):
    r = client.post("/users/update", json={"display_name": "Anything"})
    assert r.status_code == 401


def test_4_1_9_4_update_duplicate_email(client, deepnimma_auth):
    r = client.post(
        "/users/update",
        json={"email": "janedoe@gmail.com"},
        headers=deepnimma_auth,
    )
    assert r.status_code == 400

    get_r = client.get("/users/deepnimma")
    assert get_r.json()["email"] == "deepnimma@uga.edu"
