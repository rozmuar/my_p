import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [],
  controllers: [],
  exports: [],
})
export class CollectionsModule {}