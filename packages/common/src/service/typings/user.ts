import {
  Schema$Timestamp,
  Param$Search,
  Param$Pagination,
  Response$API,
  Response$PaginationAPI
} from './index';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
  GUEST = 'guest'
}

export interface Schema$User extends Schema$Timestamp {
  id: string;

  email: string;

  username: string;

  password: string;

  role: UserRole;

  nickname: string;

  avatar: string | null;
}

export interface Required$CreateUser
  extends Pick<Schema$User, 'email' | 'username' | 'password'> {}

export interface Required$UpdateUser
  extends Partial<Omit<Schema$User, 'id' | 'avatar' | keyof Schema$Timestamp>> {
  avatar?: unknown | null;
  oldAvatar?: string | null;
}

export interface Param$GetUsers extends Param$Search, Param$Pagination {}

export interface Param$CreateUser extends Required$CreateUser {
  avatar?: File | null;
  nickname?: string;
  role?: UserRole;
}

export interface Param$UpdateUser extends Required$UpdateUser {
  id: string;
  avatar?: File | null;
}

export type Response$User = Response$API<Schema$User>;

export type Response$GetUsers = Response$PaginationAPI<Schema$User>;
