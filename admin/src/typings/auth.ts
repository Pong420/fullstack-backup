import { Response$API, Schema$User } from '.';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

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

export type Response$RefreshToken = Response$API<Schema$JWT>;

export interface Schema$JWT {
  token: string;
  expiry: string;
}
