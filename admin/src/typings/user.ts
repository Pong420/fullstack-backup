export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface Param$Login {
  username: string;
  password: string;
}
