import { combineReducers, Reducer, AnyAction } from 'redux';
import { connectRouter } from 'connected-react-router';
import { AuthActionTypes } from '../actions';
import auth from './auth';
import user from './user';

const appReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    user
  });

// reset store after user logout
const rootReducer = (
  history: Parameters<typeof connectRouter>[0]
): Reducer<RootState | undefined, AnyAction> => (state, action) =>
  appReducer(history)(
    action.type === AuthActionTypes.LOGOUT_SUCCESS ? undefined : state,
    action
  );

export type RootState = ReturnType<ReturnType<typeof appReducer>>;

export default rootReducer;
