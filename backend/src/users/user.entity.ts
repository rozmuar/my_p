import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Collection } from '../collections/collection.entity';

export enum Role {
  USER = 'user',
  EDITOR = 'editor', 
  VIEWER = 'viewer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ 
    type: 'enum', 
    enum: Role, 
    default: Role.USER 
  })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @OneToMany(() => Collection, collection => collection.owner)
  collections: Collection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}