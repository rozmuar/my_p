# PostAPI Docker Management Script for PowerShell
param(
    [Parameter(Position = 0)]
    [ValidateSet("dev", "development", "prod", "production")]
    [string]$Environment = "production",
    
    [Parameter(Position = 1)]
    [ValidateSet("build", "up", "start", "down", "stop", "restart", "logs", "status", "clean", "shell", "db-backup", "db-restore", "update", "help")]
    [string]$Command = "help",
    
    [Parameter(Position = 2)]
    [string]$Service = "",
    
    [Parameter(Position = 3)]
    [string]$BackupFile = ""
)

# Colors for output
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Determine compose file
$ComposeFile = ""
switch ($Environment.ToLower()) {
    { $_ -in @("dev", "development") } {
        $ComposeFile = "docker-compose.dev.yml"
        Write-Info "Using development environment"
    }
    { $_ -in @("prod", "production") } {
        $ComposeFile = "docker-compose.yml"
        Write-Info "Using production environment"
    }
}

# Check if .env file exists
if (!(Test-Path .env)) {
    Write-Warning ".env file not found"
    if (Test-Path .env.example) {
        Write-Info "Creating .env from .env.example"
        Copy-Item .env.example .env
        Write-Warning "Please review and update .env file with your settings"
    } else {
        Write-Error ".env.example not found. Please create .env file manually"
        exit 1
    }
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)\s*$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}

# Get environment variables with defaults
$FrontendPort = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { "3000" }
$BackendPort = if ($env:BACKEND_PORT) { $env:BACKEND_PORT } else { "3001" }
$PgAdminPort = if ($env:PGADMIN_PORT) { $env:PGADMIN_PORT } else { "8080" }
$DbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$RedisPort = if ($env:REDIS_PORT) { $env:REDIS_PORT } else { "6379" }
$DbUsername = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "postgres" }
$DbName = if ($env:DB_NAME) { $env:DB_NAME } else { "postapi" }

switch ($Command.ToLower()) {
    "build" {
        Write-Info "Building Docker images..."
        docker-compose -f $ComposeFile build --no-cache
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Build completed"
        } else {
            Write-Error "Build failed"
            exit 1
        }
    }
    
    { $_ -in @("up", "start") } {
        Write-Info "Starting PostAPI services..."
        docker-compose -f $ComposeFile up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Success "PostAPI is running!"
            
            if ($Environment -in @("dev", "development")) {
                Write-Info "Development services:"
                Write-Info "- Frontend: http://localhost:$FrontendPort"
                Write-Info "- Backend API: http://localhost:$BackendPort"
                Write-Info "- PgAdmin: http://localhost:$PgAdminPort"
                Write-Info "- Database: localhost:$DbPort"
                Write-Info "- Redis: localhost:$RedisPort"
            } else {
                Write-Info "Production services:"
                Write-Info "- Frontend: http://localhost:$FrontendPort"
                Write-Info "- Backend API: http://localhost:$BackendPort/api"
            }
        } else {
            Write-Error "Failed to start services"
            exit 1
        }
    }
    
    { $_ -in @("down", "stop") } {
        Write-Info "Stopping PostAPI services..."
        docker-compose -f $ComposeFile down
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Services stopped"
        }
    }
    
    "restart" {
        Write-Info "Restarting PostAPI services..."
        docker-compose -f $ComposeFile restart
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Services restarted"
        }
    }
    
    "logs" {
        if ($Service) {
            Write-Info "Showing logs for $Service..."
            docker-compose -f $ComposeFile logs -f $Service
        } else {
            Write-Info "Showing all service logs..."
            docker-compose -f $ComposeFile logs -f
        }
    }
    
    "status" {
        Write-Info "PostAPI services status:"
        docker-compose -f $ComposeFile ps
    }
    
    "clean" {
        Write-Warning "This will remove all PostAPI containers, networks, and volumes!"
        $confirmation = Read-Host "Are you sure? (y/N)"
        if ($confirmation -match '^[Yy]$') {
            Write-Info "Cleaning up..."
            docker-compose -f $ComposeFile down -v --remove-orphans
            docker system prune -f
            Write-Success "Cleanup completed"
        } else {
            Write-Info "Cleanup cancelled"
        }
    }
    
    "shell" {
        $TargetService = if ($Service) { $Service } else { "backend" }
        Write-Info "Opening shell in $TargetService container..."
        docker-compose -f $ComposeFile exec $TargetService /bin/sh
    }
    
    "db-backup" {
        $BackupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
        Write-Info "Creating database backup: $BackupFile"
        docker-compose -f $ComposeFile exec postgres pg_dump -U $DbUsername $DbName > $BackupFile
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Backup saved as $BackupFile"
        } else {
            Write-Error "Backup failed"
        }
    }
    
    "db-restore" {
        if (-not $BackupFile -or -not (Test-Path $BackupFile)) {
            Write-Error "Backup file not specified or not found"
            Write-Info "Usage: .\docker-manage.ps1 $Environment db-restore -BackupFile <backup_file.sql>"
            exit 1
        }
        Write-Warning "This will replace the current database!"
        $confirmation = Read-Host "Are you sure? (y/N)"
        if ($confirmation -match '^[Yy]$') {
            Write-Info "Restoring database from $BackupFile..."
            Get-Content $BackupFile | docker-compose -f $ComposeFile exec -T postgres psql -U $DbUsername -d $DbName
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Database restored"
            } else {
                Write-Error "Database restore failed"
            }
        }
    }
    
    "update" {
        Write-Info "Updating PostAPI..."
        docker-compose -f $ComposeFile pull
        docker-compose -f $ComposeFile build --no-cache
        docker-compose -f $ComposeFile up -d
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Update completed"
        }
    }
    
    "help" {
        Write-Host "PostAPI Docker Management Script for PowerShell" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage: .\docker-manage.ps1 [Environment] [Command] [Options]" -ForegroundColor White
        Write-Host ""
        Write-Host "Environments:" -ForegroundColor Yellow
        Write-Host "  dev, development    - Development environment with hot reload"
        Write-Host "  prod, production    - Production environment (default)"
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor Yellow
        Write-Host "  build               - Build all docker images"
        Write-Host "  up, start           - Start all services"
        Write-Host "  down, stop          - Stop all services"  
        Write-Host "  restart             - Restart services"
        Write-Host "  status              - Show services status"
        Write-Host "  logs                - Show logs (use -Service for specific service)"
        Write-Host "  shell               - Open shell (use -Service for specific service)"
        Write-Host "  db-backup           - Create database backup"
        Write-Host "  db-restore          - Restore database (use -BackupFile for file)"
        Write-Host "  clean               - Clean up all containers and volumes"
        Write-Host "  update              - Pull latest images and rebuild"
        Write-Host "  help                - Show this help"
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Green
        Write-Host "  .\docker-manage.ps1 dev up"
        Write-Host "  .\docker-manage.ps1 prod build"
        Write-Host "  .\docker-manage.ps1 dev logs -Service backend"
        Write-Host "  .\docker-manage.ps1 prod db-backup"
        Write-Host "  .\docker-manage.ps1 dev db-restore -BackupFile backup.sql"
    }
    
    default {
        Write-Error "Unknown command: $Command"
        Write-Info "Use '.\docker-manage.ps1 help' for available commands"
        exit 1
    }
}