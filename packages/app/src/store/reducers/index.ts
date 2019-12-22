import { combineReducers, Reducer, AnyAction } from 'redux';
import { AuthActionTypes } from '../actions';
import { authRedcuer, logoutState } from './auth';

const appReducer = () =>
  combineReducers({
    auth: authRedcuer
  });

// reset store after user logout
const rootReducer = (
  ...args: Parameters<typeof appReducer>
): Reducer<RootState | undefined, AnyAction> => (state, action) =>
  appReducer(...args)(
    action.type === AuthActionTypes.LOGOUT_SUCCESS
      ? { auth: logoutState }
      : state,
    action
  );

export type RootState = ReturnType<ReturnType<typeof appReducer>>;

export default rootReducer;
