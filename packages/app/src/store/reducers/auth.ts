import { Schema$User } from '@fullstack/common/service';
import { AuthActionTypes, AuthActions } from '../actions';
import { LoginStatus } from '../';

interface SharedState {}

interface LoggedIn extends SharedState {
  loginStatus: Extract<LoginStatus, 'loggedIn'>;
  user: Schema$User;
}

interface NotLoggedIn extends SharedState {
  loginStatus: Exclude<LoginStatus, 'loggedIn'>;
  user: null;
}

type State = LoggedIn | NotLoggedIn;

export const authInitialState: State = {
  loginStatus: 'unknown',
  user: null
};

export const logoutState: NotLoggedIn = {
  loginStatus: 'required',
  user: null
};

export function authRedcuer(
  state: State = authInitialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
    case AuthActionTypes.REFRESH_TOKEN:
      return {
        ...state,
        loginStatus: 'loading',
        user: null
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loginStatus: 'loggedIn',
        user: action.payload.user
      };

    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loginStatus: 'required',
        user: null
      };

    case AuthActionTypes.UPDATE_AUTH_USER:
      return {
        ...(state as LoggedIn),
        user: {
          ...state.user!,
          ...action.payload
        }
      };

    default:
      return state;
  }
}
