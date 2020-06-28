import { JWTSignPayload, Param$Login } from '@fullstack/typings';
import { UnionCRUDActions } from '@pong420/redux-crud';
import { useActions, ActionsMap } from '../../hooks/useActions';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface LoggedIn {
  loginStatus: 'loggedIn';
  user: JWTSignPayload;
}

export interface NotLoggedIn {
  loginStatus: Exclude<LoginStatus, LoggedIn['loginStatus']>;
  user: null;
}

export const AuthActionTypes = {
  AUTHORIZE: 'AUTHORIZE' as const,
  SCCUESS: 'AUTH_SUCCESS' as const,
  FAILURE: 'AUTH_FAILURE' as const,
  LOGOUT: 'LOGOUT' as const
};

function authorize(payload?: Param$Login) {
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

const actions = {
  authorize,
  authSuccess,
  authFailure,
  logout
};

export type AuthActions = UnionCRUDActions<typeof actions>;
export type AuthActionMap = ActionsMap<AuthActions>;

export const useAuthActions = () => useActions(actions);
