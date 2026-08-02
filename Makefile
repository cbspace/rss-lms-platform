.PHONY: setup deploy stop check-env prune

setup: check-env
	# Setup a bare VM (ask first to make sure!)
	@bash -c 'read -p "Setup and install required packages? [y/N]: " confirm && [[ $$confirm == [yY] || $$confirm == [yY][eE][sS] ]] || (echo "Aborted." && exit 1)'

	@echo "Setting up environment"
	./scripts/setup.sh

stop:
	# Stop running containers if any exist, then prune
	@sudo docker-compose down

# Run 'make prune' manually whenever EC2 runs low on disk space
prune:
	@sudo docker builder prune -f
	@sudo docker image prune -f

check-env:
	# Check if a .env file has been created
	@if [ ! -f .env ]; then \
		echo "❌ Error: .env file not found, please add it!"; \
		exit 1; \
	fi

deploy: check-env stop
	# Build containers and deploy them
	@sudo docker-compose up --build -d

