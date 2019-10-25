import { UserActionTypes, UserActions } from '../actions';
import { LoginStatus } from '../../typings';

interface State {
  loginStatus: LoginStatus;
}

const initialState: State = {
  loginStatus: 'unknown'
};

export default function(
  state: State = initialState,
  action: UserActions
): State {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      return { ...state, loginStatus: 'loading' };

    case UserActionTypes.LOGIN_SUCCESS:
      return { ...state, loginStatus: 'loggedIn' };

    case UserActionTypes.LOGIN_FAILURE:
      return { ...state, loginStatus: 'required' };

    default:
      return state;
  }
}
