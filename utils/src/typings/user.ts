import { Schema$Timestamp } from './index';

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
  extends Pick<Schema$User, 'email' | 'username' | 'password' | 'role'> {
  nickname?: string;
}

export interface Required$UpdateUser
  extends Partial<Omit<Schema$User, 'id' | 'avatar' | keyof Schema$Timestamp>> {
  avatar?: unknown | null;
  oldAvatar?: string | null;
}

export interface Required$GetProducts {
  tag?: string;

  type?: string;
}
