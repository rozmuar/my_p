# 🚀 Quick Linux Deployment Guide

## One-Line Deployment

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR-USERNAME/postapi/main/deploy.sh | bash
```

## Manual Deployment Steps

### 1. Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply docker group changes
```

### 2. Deploy Application
```bash
# Clone repository
git clone YOUR_REPO_URL postapi
cd postapi

# Start services
docker-compose up -d
```

### 3. Access Application
- **Frontend**: http://YOUR_SERVER_IP:3000
- **Backend API**: http://YOUR_SERVER_IP:3001 
- **API Docs**: http://YOUR_SERVER_IP:3001/api/docs

### 4. Management Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Update application
git pull
docker-compose build --no-cache
docker-compose up -d
```

## Production Setup

### Environment Configuration
1. Copy environment file: `cp backend/.env.example backend/.env`
2. Update database credentials and JWT secret in `backend/.env`
3. Change default passwords in `docker-compose.yml`

### Nginx Reverse Proxy (Optional)
```bash
# Install Nginx
sudo apt install nginx -y

# Create PostAPI config
sudo nano /etc/nginx/sites-available/postapi

# Enable config
sudo ln -s /etc/nginx/sites-available/postapi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL Certificate (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Firewall Configuration
```bash
# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Troubleshooting

### Check Container Status
```bash
docker-compose ps
```

### View Container Logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose exec postgres psql -U postgres -d postapi -c "SELECT version();"

# Reset database
docker-compose down -v
docker-compose up -d
```

### Performance Monitoring
```bash
# Container resource usage
docker stats

# System resources
htop
```

## Backup & Restore

### Database Backup
```bash
docker-compose exec postgres pg_dump -U postgres postapi > backup.sql
```

### Database Restore
```bash
docker-compose exec -T postgres psql -U postgres postapi < backup.sql
```