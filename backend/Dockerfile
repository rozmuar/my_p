# Backend Production Dockerfile
FROM node:18-alpine AS base

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Development dependencies stage
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# Build stage
FROM base AS build
RUN npm install --include=dev
COPY . .
RUN npm run build

# Production stage
FROM base AS production

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main"]