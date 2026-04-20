def test_4_4_2_1_get_nonempty_closet(client, deepnimma_auth):
    posts = client.get("/posts/user/janedoe").json()["image_ids"]
    pid = posts[0]
    client.post("/closet/add", json={"image_id": pid}, headers=deepnimma_auth)

    r = client.get("/closet/deepnimma")
    assert r.status_code == 200
    body = r.json()
    assert pid in body["closet"]


def test_4_4_2_2_get_empty_closet(client):
    client.post(
        "/users/signup",
        json={
            "username": "empty_closet_user",
            "display_name": "Empty Closet",
            "password": "password123",
            "email": "empty_closet@example.com",
        },
    )
    r = client.get("/closet/empty_closet_user")
    assert r.status_code == 204
    assert not r.content


def test_4_4_2_3_get_closet_nonexistent_user(client):
    r = client.get("/closet/ghost_user_zzz")
    assert r.status_code == 404


def test_4_4_3_1_save_post_to_own_closet(client, deepnimma_auth):
    posts = client.get("/posts/user/alex_style").json()["image_ids"]
    pid = posts[0]

    client.post("/closet/remove", json={"image_id": pid}, headers=deepnimma_auth)

    r = client.post("/closet/add", json={"image_id": pid}, headers=deepnimma_auth)
    assert r.status_code == 200

    get_r = client.get("/closet/deepnimma")
    assert pid in get_r.json()["closet"]

    client.post("/closet/remove", json={"image_id": pid}, headers=deepnimma_auth)


def test_4_4_3_2_save_to_closet_without_token(client):
    r = client.post(
        "/closet/add",
        json={"image_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert r.status_code == 401


def test_4_4_3_3_save_to_closet_idempotent(client, deepnimma_auth):
    posts = client.get("/posts/user/alex_style").json()["image_ids"]
    pid = posts[0]

    client.post("/closet/remove", json={"image_id": pid}, headers=deepnimma_auth)

    r1 = client.post("/closet/add", json={"image_id": pid}, headers=deepnimma_auth)
    r2 = client.post("/closet/add", json={"image_id": pid}, headers=deepnimma_auth)
    assert r1.status_code == 200
    assert r2.status_code == 200

    get_r = client.get("/closet/deepnimma")
    closet = get_r.json()["closet"]
    assert closet.count(pid) == 1

    client.post("/closet/remove", json={"image_id": pid}, headers=deepnimma_auth)


def test_4_4_4_1_remove_from_own_closet(client, deepnimma_auth):
    posts = client.get("/posts/user/alex_style").json()["image_ids"]
    pid = posts[0]
    client.post("/closet/add", json={"image_id": pid}, headers=deepnimma_auth)

    r = client.post("/closet/remove", json={"image_id": pid}, headers=deepnimma_auth)
    assert r.status_code == 200

    get_r = client.get("/closet/deepnimma")
    if get_r.status_code == 200:
        assert pid not in get_r.json()["closet"]


def test_4_4_4_2_remove_without_token(client):
    r = client.post(
        "/closet/remove",
        json={"image_id": "00000000-0000-0000-0000-000000000000"},
    )
    assert r.status_code == 401
