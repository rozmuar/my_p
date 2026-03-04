import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Collection } from '../collections/collection.entity';

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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Collection, collection => collection.owner)
  collections: Collection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}