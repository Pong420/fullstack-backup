import { combineReducers, Reducer, AnyAction } from 'redux';
import auth from './auth';
import { connectRouter } from 'connected-react-router';
import { AuthActionTypes } from '../actions';

const appReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    auth
  });

// reset store after user logout
const rootReducer = (
  ...args: Parameters<typeof appReducer>
): Reducer<RootState | undefined, AnyAction> => (state, action) =>
  appReducer(...args)(
    action.type === AuthActionTypes.LOGOUT ? undefined : state,
    action
  );

export type RootState = ReturnType<ReturnType<typeof appReducer>>;

export default rootReducer;
