import pytest

VALID_POST = {
    "image": "base64imagedatasample",
    "coordinates": [{"x": 20, "y": 25, "link": "https://amazon.com/jacket"}],
    "caption": "New fit today",
    "hashtags": ["#ootd", "#streetwear"],
    "creator": "deepnimma",
}


def test_4_3_2_1_create_post_valid(client, deepnimma_auth):
    r = client.post("/posts/", json=VALID_POST, headers=deepnimma_auth)
    assert r.status_code == 200
    body = r.json()
    assert "image_id" in body
    image_id = body["image_id"]

    all_r = client.get("/posts/")
    assert image_id in all_r.json()["image_ids"]

    client.post("/posts/delete", json={"image_id": image_id}, headers=deepnimma_auth)


def test_4_3_2_2_create_post_creator_mismatch(client, deepnimma_auth):
    body = dict(VALID_POST)
    body["creator"] = "janedoe"
    r = client.post("/posts/", json=body, headers=deepnimma_auth)
    assert r.status_code == 400


def test_4_3_2_3_create_post_without_token(client):
    r = client.post("/posts/", json=VALID_POST)
    assert r.status_code == 401


@pytest.mark.parametrize("missing", ["image", "caption", "creator"])
def test_4_3_2_4_create_post_missing_field(client, deepnimma_auth, missing):
    body = dict(VALID_POST)
    body.pop(missing)
    r = client.post("/posts/", json=body, headers=deepnimma_auth)
    assert r.status_code in (400, 422)


def test_4_3_2_5_create_post_expired_token(client, expired_token):
    r = client.post(
        "/posts/",
        json=VALID_POST,
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert r.status_code == 401


def test_4_3_3_1_get_all_posts(client):
    r = client.get("/posts/")
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body["image_ids"], list)
    assert len(body["image_ids"]) >= 1


def test_4_3_4_1_get_user_posts(client):
    r = client.get("/posts/user/deepnimma")
    assert r.status_code == 200
    assert isinstance(r.json()["image_ids"], list)


def test_4_3_4_2_get_posts_nonexistent_user(client):
    r = client.get("/posts/user/ghost_user_zzz")
    assert r.status_code == 404


def test_4_3_5_1_update_own_post(client, deepnimma_auth, deepnimma_post_id):
    r = client.post(
        "/posts/update",
        json={
            "image_id": deepnimma_post_id,
            "caption": "Updated caption",
            "hashtags": ["#updated", "#newtags"],
        },
        headers=deepnimma_auth,
    )
    assert r.status_code == 200


def test_4_3_5_2_update_other_users_post(client, janedoe_auth, deepnimma_post_id):
    r = client.post(
        "/posts/update",
        json={"image_id": deepnimma_post_id, "caption": "Hijacked"},
        headers=janedoe_auth,
    )
    assert r.status_code == 400


def test_4_3_5_3_update_post_no_updatable_fields(client, deepnimma_auth, deepnimma_post_id):
    r = client.post(
        "/posts/update",
        json={"image_id": deepnimma_post_id},
        headers=deepnimma_auth,
    )
    assert r.status_code in (400, 422)


def test_4_3_6_1_delete_own_post(client, deepnimma_auth):
    create = client.post("/posts/", json=VALID_POST, headers=deepnimma_auth)
    pid = create.json()["image_id"]

    r = client.post("/posts/delete", json={"image_id": pid}, headers=deepnimma_auth)
    assert r.status_code == 200

    all_r = client.get("/posts/")
    assert pid not in all_r.json()["image_ids"]


def test_4_3_6_2_delete_other_users_post(client, janedoe_auth, deepnimma_post_id):
    r = client.post(
        "/posts/delete",
        json={"image_id": deepnimma_post_id},
        headers=janedoe_auth,
    )
    assert r.status_code == 400

    all_r = client.get("/posts/")
    assert deepnimma_post_id in all_r.json()["image_ids"]


def test_4_3_6_3_delete_nonexistent_post(client, deepnimma_auth):
    r = client.post(
        "/posts/delete",
        json={"image_id": "00000000-0000-0000-0000-000000000000"},
        headers=deepnimma_auth,
    )
    assert r.status_code == 400
