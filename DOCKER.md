# 🐳 Docker Deployment Guide

## Quick Docker Setup

### Prerequisites
- Docker (v20.10+) и Docker Compose (v2.0+)
- Свободные порты: 3000, 3001, 5432, 6379

### 1. Prepare Environment
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your production settings

# Frontend configuration (optional)
cp frontend/.env.example frontend/.env
```

### 2. Start Services
```bash
# Production deployment
docker-compose up -d --build

# Development with hot reload + PgAdmin
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# Quick validation
docker-compose config
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **PgAdmin** (dev): http://localhost:8080

## Management Commands

### Using Docker Compose
```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart service
docker-compose restart [service_name]

# Stop all
docker-compose down

# Clean up everything
docker-compose down -v --remove-orphans
```

### Using Management Scripts

**PowerShell (Windows):**
```powershell
# Start production
.\docker-manage.ps1 prod up

# Start development
.\docker-manage.ps1 dev up

# View logs
.\docker-manage.ps1 prod logs

# Stop services
.\docker-manage.ps1 prod down
```

**Bash (Linux/Mac):**
```bash
# Start production
./docker-manage.sh prod up

# Start development  
./docker-manage.sh dev up

# View logs
./docker-manage.sh prod logs

# Stop services
./docker-manage.sh prod down
```

**Make (if available):**
```bash
make up              # Start production
make up ENV=dev      # Start development
make logs            # View all logs
make logs SERVICE=backend  # View backend logs
make status          # Check status
make down            # Stop services
```

## Environment Configuration

### Required Environment Variables (.env)

```env
# Service Ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
DB_PORT=5432
REDIS_PORT=6379

# Database
DB_NAME=postapi
DB_USERNAME=postgres
DB_PASSWORD=postgres123

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Optional Development Tools
PGADMIN_EMAIL=admin@postapi.local
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=8080
```

## Docker Environments

### Production (`docker-compose.yml`)
- Multi-stage optimized builds
- Production nginx configuration
- Health checks enabled
- Persistent volumes
- Restart policies
- Security headers

### Development (`docker-compose.dev.yml`)
- Hot reload enabled
- Volume mounts for live editing
- Debug logging
- PgAdmin included
- Development-friendly settings

## Database Management

### Backup & Restore
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres postapi > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20240301.sql | docker-compose exec -T postgres psql -U postgres postapi
```

### Direct Database Access
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d postapi

# View tables
docker-compose exec postgres psql -U postgres -d postapi -c "\dt"
```

## Service Management

### Individual Service Control
```bash
# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend

# Scale services
docker-compose up -d --scale backend=2
```

### Logs & Debugging
```bash
# Follow logs for all services
docker-compose logs -f

# Follow logs for specific service
docker-compose logs -f backend

# Last 100 log lines
docker-compose logs --tail=100 frontend
```

### Health Checks
```bash
# Check health status
docker-compose ps

# Inspect health details
docker inspect postapi-backend --format='{{.State.Health.Status}}'
```

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using ports
netstat -tulpn | grep :3000

# Change ports in .env file
FRONTEND_PORT=3001
BACKEND_PORT=3002
```

**Permission issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Database connection issues:**
```bash
# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Clean Reset
```bash
# Complete cleanup
docker-compose down -v --remove-orphans
docker system prune -a -f
docker volume prune -f

# Fresh start
docker-compose up -d --build
```

## Production Deployment

### Security Considerations

1. **Change default passwords** in `.env`
2. **Use strong secrets** for JWT and sessions
3. **Configure firewall** to only expose necessary ports
4. **Use HTTPS** with reverse proxy (nginx/traefik)
5. **Regular backups** of database
6. **Monitor logs** for security events

### Reverse Proxy Setup (nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Resource Limits

Add to docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Monitoring

### Health Endpoints
- Frontend: http://localhost:3000/health  
- Backend: http://localhost:3001/api/health

### Log Rotation
```bash
# Configure log rotation in docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Metrics Collection
```bash
# Add monitoring services to docker-compose.yml
# Example: Prometheus, Grafana, etc.
```

For more detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).