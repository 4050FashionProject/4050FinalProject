# Backend Tests

Automated API tests for the endpoints described in `Test Specifications.pdf`.
Each test function is named `test_<id>_*` where `<id>` matches the spec's
Test Case ID (e.g., `test_4_1_2_1_*` = Test Case 4.1.2.1).

## Run

Start the stack first, then run pytest:

```sh
docker compose up -d
uv run --group test pytest backend/tests -v
```

Environment variables (all optional):

- `BACKEND_URL` — default `http://localhost:8000`
- `MONGO_URL` — default `mongodb://localhost:27017/mydb`
- `SECRET_KEY` — must match the backend's; default `TEST_SECRET_KEY`

The session-scoped `reset_and_seed` fixture wipes the `users` and `posts`
collections and re-seeds via the platform's own signup/login/post/follow
endpoints before any test runs, matching the seed data referenced throughout
the Test Specifications.
