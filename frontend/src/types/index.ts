export interface HttpRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
  params: Record<string, string>;
  auth?: AuthConfig;
  description?: string;
  collectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Alias for backwards compatibility
export type Request = HttpRequest;

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  requests: HttpRequest[];
  folders: CollectionFolder[];
  variables: Variable[];
  auth?: AuthConfig;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  isPublic?: boolean;
  isHidden?: boolean;
  collaborators: User[];
}

export interface CollectionFolder {
  id: string;
  name: string;
  requests: HttpRequest[];
  folders: CollectionFolder[];
  parentId?: string;
}

export interface Variable {
  id: string;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean';
}

export interface AuthConfig {
  type: 'none' | 'bearer' | 'basic' | 'api-key';
  token?: string;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
  location?: 'header' | 'query';
  addTo?: 'header' | 'query' | 'body';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'editor' | 'viewer' | 'admin' | 'superAdmin';
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive: boolean;
}

export interface CodeGeneration {
  language: string;
  code: string;
  fileName: string;
}

export interface RequestHistory {
  id: string;
  requestId: string;
  method: HttpMethod;
  url: string;
  name?: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: AuthConfig;
  timestamp: Date;
  response?: HttpResponse;
  error?: string;
  collectionName?: string;
}