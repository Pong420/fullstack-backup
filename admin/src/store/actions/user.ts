import { Param$Login } from '../../typings';

export enum UserActionTypes {
  LOGIN = 'LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}

export interface Login {
  type: UserActionTypes.LOGIN;
  payload: Param$Login;
}

export interface LoginSuccess {
  type: UserActionTypes.LOGIN_SUCCESS;
}

export interface LoginFailure {
  type: UserActionTypes.LOGIN_FAILURE;
  payload: any;
}

export interface Logout {
  type: UserActionTypes.LOGOUT;
}

export interface LogoutSuccess {
  type: UserActionTypes.LOGOUT_SUCCESS;
}

export interface LogoutFailure {
  type: UserActionTypes.LOGOUT_FAILURE;
}

export interface RefreshToken {
  type: UserActionTypes.REFRESH_TOKEN;
}

export type UserActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | Logout
  | LogoutSuccess
  | LogoutFailure
  | RefreshToken;

export function login(payload: Login['payload']): Login {
  return {
    type: UserActionTypes.LOGIN,
    payload
  };
}

export function logout(): Logout {
  return {
    type: UserActionTypes.LOGOUT
  };
}

export function refreshToken(): RefreshToken {
  return {
    type: UserActionTypes.REFRESH_TOKEN
  };
}
