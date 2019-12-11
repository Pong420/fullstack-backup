import {
  Param$Search,
  Param$Pagination,
  Response$API,
  Response$PaginationAPI
} from '.';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client'
}

export interface Param$GetUsers extends Param$Search, Param$Pagination {}

export interface Param$CreateUser
  extends Omit<Schema$User, 'id' | 'createdAt' | 'updatedAt' | 'avatar'> {
  password: string;
  avatar?: File | null;
}

export interface Param$UpdateUser extends Partial<Param$CreateUser> {
  id: string;
  oldAvatar?: string | null;
}

export interface Param$UpdateUser extends Partial<Param$CreateUser> {
  id: string;
  oldAvatar?: string | null;
}

export type Response$User = Response$API<Schema$User>;

export type Response$GetUsers = Response$PaginationAPI<Schema$User>;

export interface Schema$User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  nickname: string;
  role?: UserRole;
  createdAt: string;
  updatedAt: string;
}
