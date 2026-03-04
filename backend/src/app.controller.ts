import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('') // This will be under /api/ prefix
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'API Health check endpoint' })
  getApiHello(): object {
    return {
      message: 'PostAPI API is running!',
      version: '1.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      prefix: '/api'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Detailed health check' })
  getHealth(): object {
    return this.appService.getHealth();
  }
}