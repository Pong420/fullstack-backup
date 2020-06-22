import { Timestamp } from './';

export enum UserRole {
  ADMIN,
  MANAGER,
  CLIENT,
  GUEST
}

export interface Required$CreateUser {
  email: string;
  username: string;
  password: string;
}

export interface Schema$User extends Required$CreateUser, Timestamp {
  id: string;
  role: UserRole;
  nickname: string;
  avatar: string | null;
}

export interface Required$UpdateUser
  extends Partial<Omit<Schema$User, 'id' | 'avatar' | keyof Timestamp>> {
  avatar?: unknown | null;
}
