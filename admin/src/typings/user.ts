import { Response$API } from '.';

export enum UserRole {
  ADMIN = 'admin',
  GENERAL = 'general',
  CLIENT = 'client'
}

export interface Param$CreateUser
  extends Pick<Schema$User, 'email' | 'username' | 'role'> {
  password: string;
}

export interface Param$UpdateUser
  extends Partial<Omit<Schema$User, 'id' | 'username'>> {
  id: string;
}

export type Response$GetUsers = Response$API<Schema$User[]>;

export type Response$CreateUser = Response$API<Schema$User>;

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
