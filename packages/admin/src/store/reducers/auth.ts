import {
  AuthActionTypes,
  AuthActions,
  LoggedIn,
  NotLoggedIn
} from '../actions/auth';

type State = LoggedIn | NotLoggedIn;

const key = 'loggedIn';

const initialState: State = {
  loginStatus: localStorage.getItem(key) ? 'unknown' : 'required',
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
      localStorage.setItem(key, 'true');
      return {
        ...state,
        user: action.payload,
        loginStatus: 'loggedIn'
      };

    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.FAILURE:
      localStorage.removeItem(key);
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
