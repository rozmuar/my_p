import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.entity';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(private usersService: UsersService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check database setup status (Diagnostic only)' })
  @ApiResponse({ status: 200, description: 'Setup status retrieved successfully' })
  async getSetupStatus(): Promise<any> {
    const users = await this.usersService.findAll();
    const superAdmins = users.filter(user => user.role === Role.SUPER_ADMIN);
    
    return {
      totalUsers: users.length,
      hasSuperAdmin: superAdmins.length > 0,
      superAdmins: superAdmins.map(admin => ({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt
      })),
      firstUserLogic: {
        note: 'First registered user automatically becomes SuperAdmin',
        instruction: 'Go to /register to create the first user'
      }
    };
  }
}