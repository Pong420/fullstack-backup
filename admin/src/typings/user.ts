import { Response$API } from '.';

export enum Role {
  ADMIN = 'admin',
  GENERAL = 'general'
}

export interface Param$CreateUser
  extends Pick<Schema$User, 'username' | 'role'> {
  password: string;
}

export type Response$User = Response$API<Schema$User[]>;

export interface Schema$User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
