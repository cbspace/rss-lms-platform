.PHONY: setup deploy stop check-env prune api frontend dev migrate check-migration-needed clear-database

MAKEFLAGS += --no-print-directory

# Setup a bare VM (ask first to make sure!)
setup:
	@bash -c 'read -p "Setup and install required packages? [y/N]: " confirm && [[ $$confirm == [yY] || $$confirm == [yY][eE][sS] ]] || (echo "Aborted." && exit 1)'
	@echo "Setting up environment"
	./scripts/setup.sh

# Stop running containers if any exist
stop:
	@sudo docker-compose down

# Run 'make prune' to clean up unused containers
prune:
	@sudo docker builder prune -f
	@sudo docker image prune -f

# Check if a .env file has been created
check-env:
	@if [ ! -f .env ]; then \
		echo "❌ Error: .env file not found, please add it!"; \
		exit 1; \
	fi

# Deploy production build
prod: check-env stop
	@sudo docker-compose up --build -d

# Build and deploy api only (prod)
api:
	@sudo docker-compose up -d --build api

# # Build and deploy frontend only (prod)
frontend:
	@docker-compose up -d --build frontend

# Dev environment
dev: check-env stop
	@sudo docker-compose -f docker-compose-dev.yml up -d
	@$(MAKE) check-migration-needed

# Dev full build and run in foreground
dev-build: check-env stop
	@sudo docker-compose -f docker-compose-dev.yml up --build
	@$(MAKE) check-migration-needed

# Check for prisma schema changes and prompt for migration
check-migration-needed:
	@if [ $$(find api/prisma/schema.prisma -newer $$(ls -td api/prisma/migrations/*/ | head -n 1) 2>/dev/null) ]; then \
		echo ""; \
		echo "🔔 Notice: schema.prisma was modified since the last migration."; \
		read -p "Would you like to run 'make migrate' now? [y/N]: " ANS; \
		if [ "$$ANS" = "y" ] || [ "$$ANS" = "Y" ]; then \
			make migrate; \
		fi; \
	fi

# Migrate the prisma schema, very important!!
# Reset needs to occur befre migrate in case there is data present
# Adding --force after "reset" removes the interactive menu
migrate:
	@read -p "Enter migration name (e.g. add_user_avatar): " NAME && \
	sudo docker-compose -f docker-compose-dev.yml exec api npx prisma migrate reset && \
	sudo docker-compose -f docker-compose-dev.yml exec api npx prisma migrate dev --name $$NAME && \
	git add api/prisma/migrations/

# As the name suggests - be careful!
clear-database:
	@read -p "⚠️ Are you sure you want to wipe the database volume? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		sudo docker-compose -f docker-compose-dev.yml down -v; \
		echo "✅ Database volume wiped successfully."; \
	else \
		echo "❌ Operation cancelled."; \
	fi