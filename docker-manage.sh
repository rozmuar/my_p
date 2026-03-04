#!/bin/bash

# PostAPI Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default environment
ENV=${1:-production}
COMPOSE_FILE=""

case $ENV in
    "dev"|"development")
        COMPOSE_FILE="docker-compose.dev.yml"
        log_info "Using development environment"
        ;;
    "prod"|"production")
        COMPOSE_FILE="docker-compose.yml"
        log_info "Using production environment"
        ;;
    *)
        log_error "Unknown environment: $ENV"
        log_info "Usage: $0 [dev|prod] [command]"
        exit 1
        ;;
esac

COMMAND=${2:-help}

# Check if .env file exists
if [ ! -f .env ]; then
    log_warning ".env file not found"
    if [ -f .env.example ]; then
        log_info "Creating .env from .env.example"
        cp .env.example .env
        log_warning "Please review and update .env file with your settings"
    else
        log_error ".env.example not found. Please create .env file manually"
        exit 1
    fi
fi

# Load environment variables
set -a
[ -f .env ] && . .env
set +a

case $COMMAND in
    "build")
        log_info "Building Docker images..."
        docker-compose -f $COMPOSE_FILE build --no-cache
        log_success "Build completed"
        ;;
    
    "up"|"start")
        log_info "Starting PostAPI services..."
        docker-compose -f $COMPOSE_FILE up -d
        log_success "PostAPI is running!"
        
        if [ "$ENV" = "dev" ] || [ "$ENV" = "development" ]; then
            log_info "Development services:"
            log_info "- Frontend: http://localhost:${FRONTEND_PORT:-3000}"
            log_info "- Backend API: http://localhost:${BACKEND_PORT:-3001}"
            log_info "- PgAdmin: http://localhost:${PGADMIN_PORT:-8080}"
            log_info "- Database: localhost:${DB_PORT:-5432}"
            log_info "- Redis: localhost:${REDIS_PORT:-6379}"
        else
            log_info "Production services:"
            log_info "- Frontend: http://localhost:${FRONTEND_PORT:-3000}"
            log_info "- Backend API: http://localhost:${BACKEND_PORT:-3001}/api"
        fi
        ;;
    
    "down"|"stop")
        log_info "Stopping PostAPI services..."
        docker-compose -f $COMPOSE_FILE down
        log_success "Services stopped"
        ;;
    
    "restart")
        log_info "Restarting PostAPI services..."
        docker-compose -f $COMPOSE_FILE restart
        log_success "Services restarted"
        ;;
    
    "logs")
        SERVICE=${3:-}
        if [ -n "$SERVICE" ]; then
            log_info "Showing logs for $SERVICE..."
            docker-compose -f $COMPOSE_FILE logs -f $SERVICE
        else
            log_info "Showing all service logs..."
            docker-compose -f $COMPOSE_FILE logs -f
        fi
        ;;
    
    "status")
        log_info "PostAPI services status:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    
    "clean")
        log_warning "This will remove all PostAPI containers, networks, and volumes!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Cleaning up..."
            docker-compose -f $COMPOSE_FILE down -v --remove-orphans
            docker system prune -f
            log_success "Cleanup completed"
        else
            log_info "Cleanup cancelled"
        fi
        ;;
    
    "shell")
        SERVICE=${3:-backend}
        log_info "Opening shell in $SERVICE container..."
        docker-compose -f $COMPOSE_FILE exec $SERVICE /bin/sh
        ;;
    
    "db-backup")
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        log_info "Creating database backup: $BACKUP_FILE"
        docker-compose -f $COMPOSE_FILE exec postgres pg_dump -U ${DB_USERNAME:-postgres} ${DB_NAME:-postapi} > $BACKUP_FILE
        log_success "Backup saved as $BACKUP_FILE"
        ;;
    
    "db-restore")
        BACKUP_FILE=$3
        if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
            log_error "Backup file not specified or not found"
            log_info "Usage: $0 $ENV db-restore <backup_file.sql>"
            exit 1
        fi
        log_warning "This will replace the current database!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "Restoring database from $BACKUP_FILE..."
            cat $BACKUP_FILE | docker-compose -f $COMPOSE_FILE exec -T postgres psql -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-postapi}
            log_success "Database restored"
        fi
        ;;
    
    "update")
        log_info "Updating PostAPI..."
        docker-compose -f $COMPOSE_FILE pull
        docker-compose -f $COMPOSE_FILE build --no-cache
        docker-compose -f $COMPOSE_FILE up -d
        log_success "Update completed"
        ;;
    
    "help"|*)
        echo "PostAPI Docker Management Script"
        echo
        echo "Usage: $0 [environment] [command]"
        echo
        echo "Environments:"
        echo "  dev, development    - Development environment with hot reload"
        echo "  prod, production    - Production environment (default)"
        echo
        echo "Commands:"
        echo "  build               - Build all docker images"
        echo "  up, start           - Start all services"
        echo "  down, stop          - Stop all services"
        echo "  restart             - Restart services"
        echo "  status              - Show services status"
        echo "  logs [service]      - Show logs (all services or specific)"
        echo "  shell [service]     - Open shell in service container"
        echo "  db-backup           - Create database backup"
        echo "  db-restore <file>   - Restore database from backup"
        echo "  clean               - Clean up all containers and volumes"
        echo "  update              - Pull latest images and rebuild"
        echo "  help                - Show this help"
        echo
        echo "Examples:"
        echo "  $0 dev up          - Start development environment"
        echo "  $0 prod build      - Build production images"
        echo "  $0 dev logs backend - Show backend logs in development"
        ;;
esac