import { Response$API } from '.';

export enum Role {
  ADMIN = 'admin',
  GENERAL = 'general'
}

export interface Param$CreateUser
  extends Pick<Schema$User, 'username' | 'role'> {
  password: string;
}

export interface Param$UpdateUser extends Partial<Schema$User> {
  username: string;
}

export type Response$User = Response$API<Schema$User[]>;

export interface Schema$User {
  id: string;
  username: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}
