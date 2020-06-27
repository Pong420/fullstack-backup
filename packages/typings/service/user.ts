import { Timestamp, ApiResponse, PaginateApiResponse } from './';

export enum UserRole {
  ADMIN,
  MANAGER,
  CLIENT
}

export interface Param$CreateUser {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  nickname?: string;
  avatar?: unknown;
}

export interface Param$UpdateUser
  extends Partial<Omit<Schema$User, 'id' | 'avatar' | keyof Timestamp>> {
  avatar?: unknown | null;
}

export interface Schema$User extends Param$CreateUser, Timestamp {
  id: string;
  role: UserRole;
  nickname: string;
  avatar: string | null;
}

export type Response$GetUsers = PaginateApiResponse<Schema$User>;
export type Response$User = ApiResponse<Schema$User>;
