import { IsString, IsOptional, IsBoolean, IsObject, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CollaboratorRole } from '../collection.entity';

export class CreateCollectionDto {
  @ApiProperty({ example: 'My API Collection' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'A collection for testing user management APIs' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, example: { baseUrl: 'https://api.example.com' } })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {}

export class ShareCollectionDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ enum: CollaboratorRole, example: CollaboratorRole.VIEWER })
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}

export class CollectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  variables: Record<string, string>;

  @ApiProperty()
  isShared: boolean;

  @ApiProperty()
  owner: {
    id: string;
    email: string;
    name: string;
  };

  @ApiProperty({ type: [Object] })
  collaborators: {
    id: string;
    email: string;
    name: string;
    role: CollaboratorRole;
  }[];

  @ApiProperty()
  requestCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}