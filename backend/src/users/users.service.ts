import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('Creating user with data:', { email: createUserDto.email, name: createUserDto.name });
      
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
      console.log('Password hashed successfully');
      
      // Check if this is the first user in the system
      const userCount = await this.usersRepository.count();
      const isFirstUser = userCount === 0;
      
      const user = this.usersRepository.create({
        ...createUserDto,
        hashedPassword,
        role: isFirstUser ? Role.SUPER_ADMIN : Role.USER, // First user becomes super admin
      });
      
      console.log(isFirstUser ? 'Creating FIRST USER as SUPER ADMIN' : 'Creating regular user');
      console.log('User entity created, saving to database...');

      const savedUser = await this.usersRepository.save(user);
      console.log(`User saved successfully: ${savedUser.id} ${isFirstUser ? '(SUPER ADMIN)' : '(USER)'}`);
      
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'avatar', 'role', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'avatar', 'role', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    return isPasswordValid ? user : null;
  }
}