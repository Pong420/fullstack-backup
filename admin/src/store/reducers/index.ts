import { combineReducers, Reducer, AnyAction } from 'redux';
import { connectRouter } from 'connected-react-router';
import { UserActionTypes } from '../actions';
import user from './user';

const appReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    user
  });

// reset store after user logout
const rootReducer = (
  history: Parameters<typeof connectRouter>[0]
): Reducer<RootState | undefined, AnyAction> => (state, action) =>
  appReducer(history)(
    action.type === UserActionTypes.LOGOUT_SUCCESS ? undefined : state,
    action
  );

export type RootState = ReturnType<ReturnType<typeof appReducer>>;

export default rootReducer;
