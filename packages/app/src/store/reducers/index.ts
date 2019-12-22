import { combineReducers, Reducer, AnyAction } from 'redux';
import { AuthActionTypes } from '../actions';
import auth from './auth';

const appReducer = () =>
  combineReducers({
    auth
  });

// reset store after user logout
const rootReducer = (
  ...args: Parameters<typeof appReducer>
): Reducer<RootState | undefined, AnyAction> => (state, action) =>
  appReducer(...args)(
    action.type === AuthActionTypes.LOGOUT_SUCCESS ? undefined : state,
    action
  );

export type RootState = ReturnType<ReturnType<typeof appReducer>>;

export default rootReducer;
