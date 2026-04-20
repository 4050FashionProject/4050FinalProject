# Build all images
build:
	docker compose build
 
# Build and start all services in detached mode, then run backend tests
deploy:
	docker compose up --build -d
	@echo "Waiting for backend to be ready..."
	@until curl -sf http://localhost:8000/openapi.json > /dev/null; do sleep 1; done
	uv run --group test pytest backend/tests -v
 
# Stop and remove containers (keeps volumes)
remove:
	docker compose down
 
# Stop and remove containers, volumes, and images
clean:
	docker compose down -v --rmi local
 
# Tail logs from all services
logs:
	docker compose logs -f
 
# Restart all services
restart:
	docker compose down
	docker compose up --build -d

# Seed backend
seed:
	uv run seed.py
