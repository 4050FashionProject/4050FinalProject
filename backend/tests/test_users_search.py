import pytest


@pytest.mark.parametrize(
    "query,expected_username",
    [("deep", "deepnimma"), ("jane", "janedoe"), ("uga", "deepnimma")],
)
def test_4_1_10_1_search_matching_query(client, query, expected_username):
    r = client.get("/users/search/", params={"q": query})
    assert r.status_code == 200
    results = r.json()["results"]
    assert len(results) <= 10
    assert any(u["username"] == expected_username for u in results)
    for u in results:
        assert "password" not in u


@pytest.mark.parametrize("query", ["zzz_no_match_zzz", "@#$%"])
def test_4_1_10_2_search_no_matches(client, query):
    r = client.get("/users/search/", params={"q": query})
    assert r.status_code == 200
    assert r.json()["results"] == []


def test_4_1_10_3_search_without_query(client):
    r = client.get("/users/search/")
    assert r.status_code == 422
