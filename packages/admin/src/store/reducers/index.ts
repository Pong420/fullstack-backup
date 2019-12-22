import { combineReducers, Reducer, AnyAction } from 'redux';
import { connectRouter } from 'connected-react-router';
import { AuthActionTypes } from '../actions';
import auth from './auth';
import user from './user';
import products from './products';

const appReducer = (history: Parameters<typeof connectRouter>[0]) =>
  combineReducers({
    router: connectRouter(history),
    auth,
    user,
    products
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
