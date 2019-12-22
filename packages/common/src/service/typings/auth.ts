import { Response$API, Schema$User } from './index';

export interface Schema$JWT {
  token: string;
  expiry: string;
}

export interface Param$Login {
  username: string;
  password: string;
}

export interface Param$ModifyPassword {
  id: string;
  password: string;
  newPassword: string;
}

export interface Param$DeleteAccount {
  id: string;
  password: string;
}

export type Response$Login = Response$API<
  Schema$JWT & { user: Schema$User; isDefaultAc: boolean }
>;

export type Response$Registration = Response$API<
  Schema$JWT & { user: Schema$User }
>;

export type Response$RefreshToken = Response$API<Schema$JWT>;
