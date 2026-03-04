import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { RequestsModule } from './requests/requests.module';
import { UsersModule } from './users/users.module';
import { CodeGenerationModule } from './code-generation/code-generation.module';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'postapi',
      autoLoadEntities: true,
      synchronize: true, // Enable for table creation
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    CollectionsModule,
    RequestsModule,
    CodeGenerationModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}