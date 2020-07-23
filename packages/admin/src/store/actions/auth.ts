import {
  JWTSignPayload,
  Param$Authenticated,
  Schema$User
} from '@fullstack/typings';
import { UnionCRUDActions } from '@pong420/redux-crud';
import { useActions, ActionsMap } from '../../hooks/useActions';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface LoggedIn {
  loginStatus: 'loggedIn';
  user: JWTSignPayload & Partial<Schema$User>;
}

export interface NotLoggedIn {
  loginStatus: Exclude<LoginStatus, LoggedIn['loginStatus']>;
  user: null;
}

export const AuthActionTypes = {
  AUTHORIZE: 'AUTHORIZE' as const,
  SCCUESS: 'AUTH_SUCCESS' as const,
  FAILURE: 'AUTH_FAILURE' as const,
  LOGOUT: 'LOGOUT' as const,
  PROFILE_UPDATE: 'PROFILE_UPDATE' as const
};

function authorize(payload?: Param$Authenticated) {
  return {
    type: AuthActionTypes.AUTHORIZE,
    payload
  };
}

function authSuccess(payload: LoggedIn['user']) {
  return {
    type: AuthActionTypes.SCCUESS,
    payload
  };
}

function authFailure() {
  return {
    type: AuthActionTypes.FAILURE
  };
}

export function logout() {
  return {
    type: AuthActionTypes.LOGOUT
  };
}

export function profileUpdate(user: Partial<Schema$User>) {
  return {
    type: AuthActionTypes.PROFILE_UPDATE,
    payload: user
  };
}

const actions = {
  authorize,
  authSuccess,
  authFailure,
  logout,
  profileUpdate
};

export type AuthActions = UnionCRUDActions<typeof actions>;
export type AuthActionMap = ActionsMap<AuthActions>;

export const useAuthActions = () => useActions(actions);
