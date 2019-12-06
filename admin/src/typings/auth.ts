import { Response$API } from '.';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface Param$Login {
  username: string;
  password: string;
}

export type Response$Login = Response$API<Schema$JWT>;

export type Response$RefreshToken = Response$API<Schema$JWT>;

export interface Schema$JWT {
  token: string;
  expiry: string;
}