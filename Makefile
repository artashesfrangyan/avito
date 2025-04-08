# Project variables
BACKEND_IMAGE = avito-backend
FRONTEND_IMAGE = avito-frontend
BACKEND_CONTAINER = avito-backend-container
FRONTEND_CONTAINER = avito-frontend-container
BACKEND_PORT = 8080
FRONTEND_PORT = 3000

.PHONY: help all backend frontend run stop clean

help:
	@echo "Available commands:"
	@echo "  all          - Build and run all services"
	@echo "  backend      - Build and run backend"
	@echo "  frontend     - Build and run frontend"
	@echo "  stop         - Stop all containers"
	@echo "  clean        - Remove all containers and images"
	@echo "  logs-backend - View backend logs"
	@echo "  logs-front   - View frontend logs"

all: backend frontend

# Backend commands
backend:
	@$(MAKE) -C server build
	@$(MAKE) -C server run

# Frontend commands
frontend:
	docker build -t $(FRONTEND_IMAGE) ./client
	docker run -d --name $(FRONTEND_CONTAINER) -p $(FRONTEND_PORT):80 $(FRONTEND_IMAGE)

# Combined commands
run: backend frontend

stop:
	@$(MAKE) -C server stop
	docker stop $(FRONTEND_CONTAINER) || true

clean:
	@$(MAKE) -C server clean-all
	docker rm -f $(FRONTEND_CONTAINER) || true
	docker rmi $(FRONTEND_IMAGE) || true

killall: 
	docker-compose down -v --remove-orphans

startall:
	docker-compose up --build

rebuildall:
	docker-compose down -v --remove-orphans
	docker-compose up --build

# Logs viewing
logs-backend:
	@$(MAKE) -C server logs

logs-front:
	docker logs -f $(FRONTEND_CONTAINER)