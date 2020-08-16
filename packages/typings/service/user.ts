import {
  Timestamp,
  ApiResponse,
  PaginateApiResponse,
  Pagination,
  Search,
  DateRange
} from './';

export enum UserRole {
  ADMIN,
  MANAGER,
  CLIENT,
  GUEST = 9999
}

export interface Param$GetUsers extends Pagination, Search {
  id?: string;
  username?: string;
  email?: string;
  nickname?: string;
  role?: UserRole;
  createdAt?: DateRange;
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
  extends Partial<Pick<Schema$User, 'email' | 'role' | 'nickname'>> {
  avatar?: unknown;
}

export interface Param$User {
  id: string;
}

export interface Schema$User
  extends Omit<Required<Param$CreateUser>, 'avatar'>,
    Timestamp {
  id: string;
  avatar: string | null;
}

export type Response$GetUsers = PaginateApiResponse<Schema$User>;
export type Response$User = ApiResponse<Schema$User>;
