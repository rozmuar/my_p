import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Collection } from '../collections/collection.entity';
import { User } from '../users/user.entity';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

@Entity('requests')
export class HttpRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: HttpMethod })
  method: HttpMethod;

  @Column()
  url: string;

  @Column('jsonb', { default: {} })
  headers: Record<string, string>;

  @Column('text', { nullable: true })
  body?: string;

  @Column('jsonb', { default: {} })
  params: Record<string, string>;

  @Column('jsonb', { nullable: true })
  auth?: {
    type: 'none' | 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    key?: string;
    value?: string;
    addTo?: 'header' | 'query';
  };

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Collection, collection => collection.requests, { onDelete: 'CASCADE' })
  collection: Collection;

  @Column()
  collectionId: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column()
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}