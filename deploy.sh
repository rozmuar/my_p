#!/bin/bash

# PostAPI Deployment Script for Linux Server
# This script sets up and deploys PostAPI on a fresh Linux server

set -e  # Exit on any error

echo "🚀 Starting PostAPI deployment..."

# Colors for output  
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo -e "${BLUE}📦 Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install Git if not present
if ! command -v git &> /dev/null; then
    echo -e "${BLUE}📚 Installing Git...${NC}"
    sudo apt install git -y
else
    echo -e "${GREEN}✅ Git already installed${NC}"
fi

# Clone repository (if not already cloned)
if [ ! -d "postapi" ]; then
    echo -e "${BLUE}📥 Cloning PostAPI repository...${NC}"
    git clone https://github.com/rozmuar/my_p.git postapi
    cd postapi
else
    echo -e "${BLUE}🔄 Updating existing repository...${NC}"
    cd postapi
    git pull
fi

# Create production environment file
echo -e "${BLUE}⚙️ Setting up environment configuration...${NC}"
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" backend/.env
    
    echo -e "${YELLOW}📝 Please review and update backend/.env file with your settings${NC}"
    echo -e "${YELLOW}   Especially database credentials and JWT secret${NC}"
fi

# Create data directories for persistent storage
sudo mkdir -p /opt/postapi/postgres /opt/postapi/redis
sudo chown -R $USER:$USER /opt/postapi

# Start services
echo -e "${BLUE}🚀 Starting PostAPI services...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 30

# Check service health
echo -e "${BLUE}🏥 Checking service health...${NC}"

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Containers are running${NC}"
else
    echo -e "${RED}❌ Some containers failed to start${NC}"
    docker-compose logs
    exit 1
fi

# Check frontend accessibility
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not yet ready, please wait...${NC}"
fi

# Check backend health  
if curl -s http://localhost:3001/api > /dev/null; then
    echo -e "${GREEN}✅ Backend API is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not yet ready, please wait...${NC}"
fi

# Show final status
echo ""
echo -e "${GREEN}🎉 PostAPI deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Service URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://$(curl -s ifconfig.me):3000${NC}"
echo -e "   Backend:  ${GREEN}http://$(curl -s ifconfig.me):3001${NC}"
echo -e "   API Docs: ${GREEN}http://$(curl -s ifconfig.me):3001/api/docs${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   Stop:    ${YELLOW}docker-compose down${NC}"
echo -e "   Restart: ${YELLOW}docker-compose restart${NC}"
echo -e "   Logs:    ${YELLOW}docker-compose logs -f${NC}"
echo -e "   Update:  ${YELLOW}git pull && docker-compose build --no-cache && docker-compose up -d${NC}"
echo ""
echo -e "${BLUE}📁 Project directory: ${PWD}${NC}"
echo ""

# Setup firewall rules (optional)
read -p "🔥 Do you want to configure UFW firewall? (y/N): " configure_firewall
if [[ $configure_firewall =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔥 Configuring firewall...${NC}"
    sudo ufw allow ssh
    sudo ufw allow 3000/tcp
    sudo ufw allow 3001/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✅ Firewall configured${NC}"
fi

# Setup nginx reverse proxy (optional)
read -p "🌐 Do you want to setup Nginx reverse proxy? (y/N): " setup_nginx
if [[ $setup_nginx =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🌐 Setting up Nginx reverse proxy...${NC}"
    sudo apt install nginx -y
    
    # Create nginx config for PostAPI
    sudo tee /etc/nginx/sites-available/postapi > /dev/null <<EOF
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/postapi /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    echo -e "${GREEN}✅ Nginx configured${NC}"
    echo -e "${YELLOW}📝 Please update YOUR_DOMAIN_HERE in /etc/nginx/sites-available/postapi${NC}"
fi

echo -e "${GREEN}🚀 Deployment script completed successfully!${NC}"