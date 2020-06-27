import {
  AuthActionTypes,
  AuthActions,
  LoggedIn,
  NotLoggedIn
} from '../actions/auth';

type State = LoggedIn | NotLoggedIn;

const initialState: State = {
  loginStatus: 'unknown',
  user: null
};

export default function (
  state: State = initialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.AUTHORIZE:
      return {
        ...state,
        user: null,
        loginStatus: 'loading'
      };

    case AuthActionTypes.SCCUESS:
      return {
        ...state,
        user: action.payload,
        loginStatus: 'loggedIn'
      };

    case AuthActionTypes.FAILURE:
      return {
        ...state,
        user: null,
        loginStatus: 'required'
      };

    default:
      return state;
  }
}
