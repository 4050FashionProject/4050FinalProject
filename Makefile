# Build all images
build:
	docker compose build
 
# Build and start all services in detached mode
deploy:
	docker compose up --build -d
 
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
