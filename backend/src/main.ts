import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
          docs: '/api/docs',
          health: '/api/health'
        }
      });
      return;
    }
    next();
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api');

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
  console.log(`Swagger docs: http://localhost:3001/api/docs`);
}

bootstrap();