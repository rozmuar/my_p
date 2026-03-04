import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
      firstUser: users.length > 0 ? {
        id: users[0].id,
        email: users[0].email,
        name: users[0].name,
        role: users[0].role,
        createdAt: users[0].createdAt
      } : null,
      firstUserLogic: {
        note: 'First registered user should be SuperAdmin',
        needsFix: users.length > 0 && superAdmins.length === 0
      }
    };
  }

  @Post('promote-first-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Promote first registered user to SuperAdmin (One-time fix only)' })
  @ApiResponse({ status: 200, description: 'First user promoted successfully' })
  async promoteFirstUser(@Body() body: { confirmEmail: string }): Promise<any> {
    try {
      const users = await this.usersService.findAll();
      
      if (users.length === 0) {
        return {
          success: false,
          message: 'Нет пользователей в системе. Зарегистрируйтесь первым.'
        };
      }

      const firstUser = users.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
      
      // Security check - confirm email
      if (body.confirmEmail !== firstUser.email) {
        return {
          success: false,
          message: 'Email не совпадает с первым пользователем в системе',
          hint: `Ожидается: ${firstUser.email}`
        };
      }

      // Check if already SuperAdmin
      if (firstUser.role === Role.SUPER_ADMIN) {
        return {
          success: false,
          message: 'Первый пользователь уже является SuperAdmin',
          user: {
            id: firstUser.id,
            email: firstUser.email,
            name: firstUser.name,
            role: firstUser.role
          }
        };
      }

      // Promote to SuperAdmin
      await this.usersService.update(firstUser.id, { role: Role.SUPER_ADMIN });
      const updatedUser = await this.usersService.findOne(firstUser.id);

      return {
        success: true,
        message: 'Первый пользователь успешно назначен SuperAdmin!',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Ошибка при назначении роли',
        error: error.message
      };
    }
  }
}