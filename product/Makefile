.PHONY: help install dev build test clean docker-up docker-down db-setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

dev: ## Start development servers
	pnpm dev:all

dev-admin: ## Start admin (UI + API) only
	pnpm dev:admin

dev-front: ## Start frontend (UI + API) only
	pnpm dev:front

build: ## Build all packages
	pnpm build

test: ## Run tests
	pnpm test

test-e2e: ## Run E2E tests
	pnpm test:e2e

clean: ## Clean build artifacts
	pnpm clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules

docker-up: ## Start all Docker services
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-build: ## Build Docker images
	docker-compose build

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-clean: ## Remove Docker volumes
	docker-compose down -v

db-setup: ## Setup database (generate, migrate, seed)
	pnpm db:generate
	pnpm db:migrate
	pnpm db:seed

db-reset: ## Reset database
	pnpm db:push --force-reset
	pnpm db:seed

db-studio: ## Open Prisma Studio
	pnpm db:studio

lint: ## Lint code
	pnpm lint

format: ## Format code
	pnpm format

