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
    case AuthActionTypes.AUTHENTICATE:
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

    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.FAILURE:
      return {
        ...state,
        user: null,
        loginStatus: 'required'
      };

    case AuthActionTypes.PROFILE_UPDATE:
      if (state.loginStatus === 'loggedIn') {
        return {
          ...state,
          user: {
            ...state.user,
            ...action.payload
          }
        };
      }
      return state;

    default:
      return state;
  }
}
