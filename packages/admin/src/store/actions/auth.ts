import { Param$Login, Response$Login, Schema$User } from '../../typings';
import { useActions } from '../';

export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  UPDATE_AUTH_USER = 'UPDATE_AUTH_USER'
}

export interface Login {
  type: AuthActionTypes.LOGIN;
  payload: Param$Login;
}

export interface LoginSuccess {
  type: AuthActionTypes.LOGIN_SUCCESS;
  payload: Response$Login['data'];
}

export interface LoginFailure {
  type: AuthActionTypes.LOGIN_FAILURE;
  payload: any;
}

export interface Logout {
  type: AuthActionTypes.LOGOUT;
}

export interface LogoutSuccess {
  type: AuthActionTypes.LOGOUT_SUCCESS;
}

export interface LogoutFailure {
  type: AuthActionTypes.LOGOUT_FAILURE;
}

export interface RefreshToken {
  type: AuthActionTypes.REFRESH_TOKEN;
}

export interface UpdateAuthUser {
  type: AuthActionTypes.UPDATE_AUTH_USER;
  payload: Partial<Schema$User>;
}

export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | Logout
  | LogoutSuccess
  | LogoutFailure
  | RefreshToken
  | UpdateAuthUser;

export function login(payload: Login['payload']): Login {
  return {
    type: AuthActionTypes.LOGIN,
    payload
  };
}

export function logout(): Logout {
  return {
    type: AuthActionTypes.LOGOUT
  };
}

export function refreshToken(): RefreshToken {
  return {
    type: AuthActionTypes.REFRESH_TOKEN
  };
}

export function updateAuthUser(
  payload: UpdateAuthUser['payload']
): UpdateAuthUser {
  return {
    type: AuthActionTypes.UPDATE_AUTH_USER,
    payload
  };
}

const actions = {
  login,
  logout,
  refreshToken,
  updateAuthUser
};

export const useAuthActions = () => useActions(actions);
