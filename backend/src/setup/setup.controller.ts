import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@ApiTags('setup')
@Controller('setup')
export class SetupController {
  constructor(private usersService: UsersService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check database setup status' })
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
      allUsers: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }))
    };
  }

  @Post('create-admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create default super admin user' })
  @ApiResponse({ status: 200, description: 'Super admin created successfully' })
  async createDefaultAdmin(@Body() adminData: { email?: string; password?: string; name?: string }): Promise<any> {
    const defaultEmail = adminData?.email || 'admin@postapi.com';
    const defaultPassword = adminData?.password || 'admin123456';
    const defaultName = adminData?.name || 'PostAPI Admin';

    try {
      // Check if super admin already exists
      const existingUser = await this.usersService.findByEmail(defaultEmail);
      if (existingUser) {
        return {
          success: false,
          message: 'Пользователь с таким email уже существует',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role
          }
        };
      }

      // Create super admin
      const user = await this.usersService.create({
        email: defaultEmail,
        password: defaultPassword,
        name: defaultName
      });

      // Force role to be super admin (override the first user logic)
      await this.usersService.update(user.id, { role: Role.SUPER_ADMIN });
      const updatedUser = await this.usersService.findOne(user.id);

      return {
        success: true,
        message: 'Super Admin успешно создан!',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        },
        credentials: {
          email: defaultEmail,
          password: defaultPassword,
          note: 'Сохраните эти данные для входа!'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка создания администратора',
        error: error.message
      };
    }
  }
}