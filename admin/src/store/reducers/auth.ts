import { AuthActionTypes, AuthActions } from '../actions';
import { LoginStatus, Schema$User } from '../../typings';

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

const initialState: State = {
  loginStatus: 'unknown',
  user: null
};

export default function(
  state: State = initialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
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

    default:
      return state;
  }
}
