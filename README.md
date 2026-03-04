# PostAPI - Modern API Testing Tool

A modern, feature-rich API testing application built with React and NestJS. This is an alternative to Postman with a clean, intuitive interface and powerful collaboration features.

![PostAPI Logo](https://via.placeholder.com/150x150/0ea5e9/ffffff?text=PostAPI)

## 🚀 Features

### Core Functionality
- **HTTP Request Testing** - Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- **Collections Management** - Organize requests into collections and folders
- **Environment Variables** - Manage different environments with variable substitution
- **Request History** - Track all your requests and responses
- **Response Viewer** - Beautiful JSON formatting with syntax highlighting

### Advanced Features
- **Code Generation** - Generate code snippets in multiple languages (JavaScript, Python, Go, cURL, etc.)
- **Team Collaboration** - Share collections and work together in real-time
- **Authentication Support** - Bearer Token, Basic Auth, API Key authentication
- **Modern UI/UX** - Clean, responsive design built with Tailwind CSS
- **Real-time Sync** - WebSocket-based collaboration features

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Monaco Editor** for code editing
- **Axios** for HTTP requests

### Backend
- **NestJS** with TypeScript
- **PostgreSQL** database with TypeORM
- **JWT** authentication
- **WebSocket** for real-time features
- **Swagger** API documentation

## 📋 Prerequisites

Choose one of these setup methods:

### 🐳 Option A: Docker (Recommended for quick start)
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git** for cloning the repository

### 💻 Option B: Local Development
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v13 or higher)

## 🚀 Quick Start

### 🐳 Docker Setup (Fastest Way)

```bash
# 1. Clone repository
git clone https://github.com/your-username/postapi.git
cd postapi

# 2. Create environment config
cp .env.example .env

# 3. Start all services
docker-compose up -d
```

**Access your application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

📖 **For detailed Docker instructions, see [DOCKER.md](DOCKER.md)**

---

### 💻 Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/postapi.git
cd postapi
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Install all dependencies (frontend and backend)
npm run install:all
\`\`\`

### 3. Environment Setup

Create environment files for both frontend and backend:

**Backend (.env)**
\`\`\`env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=postapi

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
\`\`\`

### 4. Database Setup

\`\`\`bash
# Create PostgreSQL database
createdb postapi

# The application will automatically create tables on first run
\`\`\`

### 5. Start Application

Choose one of the deployment methods:

#### Option A: Docker (Recommended for Production)
\`\`\`bash
# Quick Docker deployment
docker-compose up -d --build
\`\`\`

This will start all services including PostgreSQL and Redis automatically.

#### Option B: Development Mode
\`\`\`bash
# Start both frontend and backend in development mode
npm run dev
\`\`\`

**Access URLs:**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

> 💡 **Note**: For detailed Docker setup instructions, see [DOCKER.md](./DOCKER.md)

## 📁 Project Structure

\`\`\`
postapi/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand state management
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript type definitions
│   └── ...
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # User management
│   │   ├── collections/      # Collections management
│   │   ├── requests/         # HTTP requests handling
│   │   ├── code-generation/  # Code generation service
│   │   └── collaboration/    # Real-time collaboration
│   └── ...
└── ...
\`\`\`

## 🔧 Available Scripts

### Root Level
- \`npm run dev\` - Start both frontend and backend in development mode
- \`npm run build\` - Build both applications for production
- \`npm run install:all\` - Install dependencies for all workspaces
- \`npm run clean\` - Clean all node_modules and build artifacts

### Frontend
- \`npm run dev\` - Start Vite development server
- \`npm run build\` - Build for production
- \`npm run lint\` - Run ESLint
- \`npm run preview\` - Preview production build

### Backend
- \`npm run start:dev\` - Start in development mode with hot reload
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run test\` - Run tests

## 🚀 Deployment

### 🐳 Docker Deployment (Recommended)

**Quick Start:**
\`\`\`bash
# Start all services with Docker Compose
docker-compose up -d
\`\`\`

**Access Application:**
- **Frontend**: http://localhost:3000 (or YOUR_SERVER_IP:3000)
- **Backend API**: http://localhost:3001 (or YOUR_SERVER_IP:3001)  
- **API Docs**: http://localhost:3001/api/docs

**Services Included:**
- PostgreSQL database with persistent storage
- Redis for caching and sessions
- NestJS backend application
- React frontend with nginx
- Automatic database migrations

### 🌐 Linux Server Deployment

For production deployment on Linux servers, see our complete [Deployment Guide](DEPLOYMENT.md).

**One-line deployment:**
\`\`\`bash
./deploy.sh
\`\`\`

This script will:
- ✅ Install Docker and Docker Compose  
- ✅ Set up firewall rules
- ✅ Configure production environment
- ✅ Start all services
- ✅ Run health checks

### Manual Deployment

1. **Build the applications:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set up production environment:**
   - Configure PostgreSQL database
   - Set environment variables
   - Configure reverse proxy (nginx)

3. **Start the services:**
   \`\`\`bash
   # Start backend
   cd backend && npm run start

   # Serve frontend (use a static file server)
   cd frontend && npx serve -s dist
   \`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Postman's user experience
- Built with amazing open-source technologies
- Special thanks to the React and NestJS communities

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/your-username/postapi/issues)
3. Create a new issue if needed

---

**Made with ❤️ by the PostAPI team**