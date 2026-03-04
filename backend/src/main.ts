import { NestFactory } from '@nestjs/core';
import { ValidationPipe, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { Role } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://62.113.110.83',
      'http://62.113.110.83:3000',
      'http://62.113.110.83:8080'
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Add root health endpoint before global prefix
  app.use('/', (req, res, next) => {
    if (req.method === 'GET' && req.url === '/') {
      res.json({
        message: 'PostAPI Backend is running!',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        endpoints: {
          api: '/api',
          docs: '/api/docs (Admin only - JWT required)',
          health: '/api/health'
        },
        auth: {
          note: 'Swagger documentation requires admin JWT token',
          header: 'Authorization: Bearer <admin-jwt-token>'
        }
      });
      return;
    }
    next();
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  // Protect Swagger docs with admin authentication
  app.use('/api/docs*', async (req, res, next) => {
    try {
      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Доступ к документации запрещен. Требуется авторизация.',
          error: 'Unauthorized',
          hint: 'Добавьте заголовок: Authorization: Bearer <your-admin-jwt-token>'
        });
      }

      const token = authHeader.substring(7);
      
      try {
        // Get services from app context
        const jwtService = app.get(JwtService);
        const usersService = app.get(UsersService);
        
        // Verify JWT token
        const payload = jwtService.verify(token);
        const user = await usersService.findOne(payload.sub);
        
        // Check if user has admin privileges
        const allowedRoles = [Role.ADMIN, Role.SUPER_ADMIN];
        
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({
            statusCode: 403,
            message: 'Доступ к документации запрещен. Требуются права администратора.',
            error: 'Forbidden',
            hint: 'Обратитесь к супер администратору для получения прав доступа',
            yourRole: user.role,
            requiredRoles: allowedRoles
          });
        }

        // User is authorized, proceed to Swagger
        next();
        
      } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
          return res.status(401).json({
            statusCode: 401,
            message: 'Недействительный или истекший токен.',
            error: 'Unauthorized',
            jwtError: error.message
          });
        }
        
        return res.status(500).json({
          statusCode: 500,
          message: 'Ошибка проверки прав доступа',
          error: 'Internal Server Error'
        });
      }
      
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'Ошибка сервера при проверке доступа к документации',
        error: 'Internal Server Error'
      });
    }
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('PostAPI Backend')
    .setDescription('Modern API testing tool backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`Application is running on: http://localhost:3001`);
  console.log(`Swagger docs (Admin only): http://localhost:3001/api/docs`);
  console.log(`⚠️  Swagger требует JWT токен администратора в заголовке Authorization`);
}

bootstrap();