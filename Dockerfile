# Multi-stage production Docker build

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

# Stage 2: Build backend  
FROM node:18-alpine AS backend-builder

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
RUN npm run build

# Stage 3: Production runtime
FROM nginx:1.24-alpine AS production

# Copy frontend build
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Install Node.js for backend
RUN apk add --no-cache nodejs npm curl

# Set up backend
WORKDIR /app
COPY --from=backend-builder /app/dist ./api/dist
COPY --from=backend-builder /app/node_modules ./api/node_modules
COPY --from=backend-builder /app/package.json ./api/

# Create startup script
COPY <<EOF /start.sh
#!/bin/sh
# Start backend API in background
cd /app/api && node dist/main.js &
# Start nginx in foreground
nginx -g "daemon off;"
EOF

RUN chmod +x /start.sh

EXPOSE 80 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/health && curl -f http://localhost:3001/api/health || exit 1

CMD ["/start.sh"]