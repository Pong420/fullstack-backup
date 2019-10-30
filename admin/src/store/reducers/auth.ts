import { AuthActionTypes, AuthActions } from '../actions';
import { LoginStatus } from '../../typings';

interface State {
  loginStatus: LoginStatus;
}

const initialState: State = {
  loginStatus: 'unknown'
};

export default function(
  state: State = initialState,
  action: AuthActions
): State {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, loginStatus: 'loading' };

    case AuthActionTypes.LOGIN_SUCCESS:
      return { ...state, loginStatus: 'loggedIn' };

    case AuthActionTypes.LOGIN_FAILURE:
      return { ...state, loginStatus: 'required' };

    default:
      return state;
  }
}
