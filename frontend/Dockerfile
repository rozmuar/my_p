# Frontend Production Dockerfile
FROM node:18-alpine AS base

# Install dependencies needed for some npm packages
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Dependencies stage
FROM base AS deps
RUN npm install --only=production

# Build stage
FROM base AS build

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage  
FROM nginx:1.24-alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Create nginx user for security
RUN addgroup -g 101 -S nginx && adduser -S nginx -G nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]