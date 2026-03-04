import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { HttpRequest } from '../requests/request.entity';

export enum CollaboratorRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb', { default: {} })
  variables: Record<string, string>;

  @Column({ default: false })
  isShared: boolean;

  @ManyToOne(() => User, user => user.collections)
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => HttpRequest, request => request.collection)
  requests: HttpRequest[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'collection_collaborators',
    joinColumns: [{ name: 'collectionId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'userId', referencedColumnName: 'id' }],
  })
  collaborators: User[];

  @Column('jsonb', { default: {} })
  collaboratorRoles: Record<string, CollaboratorRole>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}