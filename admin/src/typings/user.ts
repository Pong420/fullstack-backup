import {
  Param$Search,
  Param$Pagination,
  Response$API,
  Response$PaginationAPI,
  Schema$Timestamp
} from '.';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
  GUEST = 'guest'
}

export interface Param$GetUsers extends Param$Search, Param$Pagination {}

export interface Param$CreateUser
  extends Omit<Schema$User, 'id' | 'avatar' | keyof Schema$Timestamp> {
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

export interface Schema$User extends Schema$Timestamp {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  nickname: string;
  role: UserRole;
}
