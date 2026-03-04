import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('') // This will be under /api/ prefix
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource
  ) {}

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
  async getHealth(): Promise<object> {
    const baseHealth = this.appService.getHealth();
    
    // Check database connection
    let databaseStatus = 'disconnected';
    let databaseError = null;
    try {
      await this.dataSource.query('SELECT 1');
      databaseStatus = 'connected';
    } catch (error) {
      console.error('Database connection error:', error);
      databaseError = (error as Error).message;
    }

    return {
      ...baseHealth,
      database: {
        status: databaseStatus,
        error: databaseError
      }
    };
  }

  @Get('test-db')
  @ApiOperation({ summary: 'Test database operations' })
  async testDatabase(): Promise<object> {
    try {
      // Test basic query
      const result = await this.dataSource.query('SELECT NOW() as current_time');
      
      // Test users table
      let usersTableExists = false;
      try {
        await this.dataSource.query('SELECT COUNT(*) FROM users');
        usersTableExists = true;
      } catch (error) {
        console.log('Users table does not exist:', (error as Error).message);
      }

      return {
        message: 'Database test completed',
        currentTime: result[0]?.current_time,
        usersTableExists,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        message: 'Database test failed',
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      };
    }
  }
}