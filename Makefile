# PostAPI Docker Makefile
.PHONY: help build up down restart logs status clean shell db-backup db-restore update
.DEFAULT_GOAL := help

# Environment settings
ENV ?= production
COMPOSE_FILE = docker-compose.yml
COMPOSE_FILE_DEV = docker-compose.dev.yml

# Colors for help
YELLOW := \033[33m
GREEN := \033[32m
BLUE := \033[34m
RED := \033[31m
RESET := \033[0m

# Check if .env exists, create from example if not
.env:
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example$(RESET)"; \
		cp .env.example .env; \
		echo "$(RED)Please review and update .env file with your settings$(RESET)"; \
	fi

help: ## Show this help message
	@echo "$(BLUE)PostAPI Docker Management$(RESET)"
	@echo ""
	@echo "$(YELLOW)Available targets:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Environment variables:$(RESET)"
	@echo "  ENV=dev          Use development environment"
	@echo "  ENV=prod         Use production environment (default)"
	@echo ""
	@echo "$(YELLOW)Examples:$(RESET)"
	@echo "  make up ENV=dev       Start development environment"
	@echo "  make logs SERVICE=backend Show backend logs"
	@echo "  make shell SERVICE=frontend Open frontend shell"

build: .env ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) build --no-cache; \
	else \
		docker-compose -f $(COMPOSE_FILE) build --no-cache; \
	fi
	@echo "$(GREEN)Build completed$(RESET)"

up: .env ## Start all services
	@echo "$(BLUE)Starting PostAPI services...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) up -d; \
		echo "$(GREEN)Development environment is running!$(RESET)"; \
		echo "Frontend: http://localhost:3000"; \
		echo "Backend: http://localhost:3001"; \
		echo "PgAdmin: http://localhost:8080"; \
	else \
		docker-compose -f $(COMPOSE_FILE) up -d; \
		echo "$(GREEN)Production environment is running!$(RESET)"; \
		echo "Frontend: http://localhost:3000"; \
		echo "Backend: http://localhost:3001/api"; \
	fi

down: ## Stop all services
	@echo "$(BLUE)Stopping PostAPI services...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) down; \
	else \
		docker-compose -f $(COMPOSE_FILE) down; \
	fi
	@echo "$(GREEN)Services stopped$(RESET)"

restart: ## Restart all services
	@echo "$(BLUE)Restarting PostAPI services...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) restart; \
	else \
		docker-compose -f $(COMPOSE_FILE) restart; \
	fi
	@echo "$(GREEN)Services restarted$(RESET)"

logs: ## Show service logs (use SERVICE=name for specific service)
	@if [ -n "$(SERVICE)" ]; then \
		echo "$(BLUE)Showing logs for $(SERVICE)...$(RESET)"; \
		if [ "$(ENV)" = "dev" ]; then \
			docker-compose -f $(COMPOSE_FILE_DEV) logs -f $(SERVICE); \
		else \
			docker-compose -f $(COMPOSE_FILE) logs -f $(SERVICE); \
		fi; \
	else \
		echo "$(BLUE)Showing all service logs...$(RESET)"; \
		if [ "$(ENV)" = "dev" ]; then \
			docker-compose -f $(COMPOSE_FILE_DEV) logs -f; \
		else \
			docker-compose -f $(COMPOSE_FILE) logs -f; \
		fi; \
	fi

status: ## Show services status
	@echo "$(BLUE)PostAPI services status:$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) ps; \
	else \
		docker-compose -f $(COMPOSE_FILE) ps; \
	fi

clean: ## Clean up containers, networks and volumes
	@echo "$(RED)This will remove all PostAPI containers, networks, and volumes!$(RESET)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(BLUE)Cleaning up...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) down -v --remove-orphans; \
	else \
		docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans; \
	fi
	@docker system prune -f
	@echo "$(GREEN)Cleanup completed$(RESET)"

shell: ## Open shell in service (default: backend, use SERVICE=name)
	@SERVICE_NAME=$${SERVICE:-backend}; \
	echo "$(BLUE)Opening shell in $$SERVICE_NAME container...$(RESET)"; \
	if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) exec $$SERVICE_NAME /bin/sh; \
	else \
		docker-compose -f $(COMPOSE_FILE) exec $$SERVICE_NAME /bin/sh; \
	fi

db-backup: ## Create database backup
	@BACKUP_FILE="backup_$$(date +%Y%m%d_%H%M%S).sql"; \
	echo "$(BLUE)Creating database backup: $$BACKUP_FILE$(RESET)"; \
	if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) exec postgres pg_dump -U postgres postapi_dev > $$BACKUP_FILE; \
	else \
		docker-compose -f $(COMPOSE_FILE) exec postgres pg_dump -U postgres postapi > $$BACKUP_FILE; \
	fi; \
	echo "$(GREEN)Backup saved as $$BACKUP_FILE$(RESET)"

db-restore: ## Restore database from backup (use BACKUP=filename.sql)
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(RED)Backup file not specified$(RESET)"; \
		echo "Usage: make db-restore BACKUP=backup_file.sql"; \
		exit 1; \
	fi
	@if [ ! -f "$(BACKUP)" ]; then \
		echo "$(RED)Backup file not found: $(BACKUP)$(RESET)"; \
		exit 1; \
	fi
	@echo "$(RED)This will replace the current database!$(RESET)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(BLUE)Restoring database from $(BACKUP)...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		cat $(BACKUP) | docker-compose -f $(COMPOSE_FILE_DEV) exec -T postgres psql -U postgres -d postapi_dev; \
	else \
		cat $(BACKUP) | docker-compose -f $(COMPOSE_FILE) exec -T postgres psql -U postgres -d postapi; \
	fi
	@echo "$(GREEN)Database restored$(RESET)"

update: ## Pull latest images and rebuild
	@echo "$(BLUE)Updating PostAPI...$(RESET)"
	@if [ "$(ENV)" = "dev" ]; then \
		docker-compose -f $(COMPOSE_FILE_DEV) pull; \
		docker-compose -f $(COMPOSE_FILE_DEV) build --no-cache; \
		docker-compose -f $(COMPOSE_FILE_DEV) up -d; \
	else \
		docker-compose -f $(COMPOSE_FILE) pull; \
		docker-compose -f $(COMPOSE_FILE) build --no-cache; \
		docker-compose -f $(COMPOSE_FILE) up -d; \
	fi
	@echo "$(GREEN)Update completed$(RESET)"

dev-up: ## Start development environment
	@$(MAKE) up ENV=dev

dev-down: ## Stop development environment 
	@$(MAKE) down ENV=dev

dev-logs: ## Show development logs
	@$(MAKE) logs ENV=dev

prod-up: ## Start production environment
	@$(MAKE) up ENV=prod

prod-down: ## Stop production environment
	@$(MAKE) down ENV=prod

prod-logs: ## Show production logs
	@$(MAKE) logs ENV=prod