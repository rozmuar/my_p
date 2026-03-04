import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpRequest } from './request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HttpRequest])],
  providers: [],
  controllers: [],
  exports: [],
})
export class RequestsModule {}