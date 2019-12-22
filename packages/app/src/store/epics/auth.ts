import { from, of, merge } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import {
  AuthActions,
  AuthActionTypes,
  Login,
  Logout,
  Registration,
  RefreshToken
} from '../actions/auth';
import { RootState } from '../reducers';
import {
  login,
  logout,
  refreshToken,
  registration,
  getUserInfo
} from '../../service';

type Actions = AuthActions;
type AuthEpic = Epic<Actions, Actions, RootState>;

const loginEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType<Actions, Login | Registration | RefreshToken>(
      AuthActionTypes.LOGIN,
      AuthActionTypes.REGISTRATION,
      AuthActionTypes.REFRESH_TOKEN
    ),
    map(action => {
      switch (action.type) {
        case AuthActionTypes.LOGIN:
          return login(action.payload).then(res => res.data.data);
        case AuthActionTypes.REGISTRATION:
          return registration(action.payload).then(res => res.data.data);
        case AuthActionTypes.REFRESH_TOKEN:
          return refreshToken().then(async token =>
            getUserInfo().then(res => ({
              ...token.data.data,
              user: res.data.data
            }))
          );
      }
    }),
    switchMap(promise => {
      return from(promise).pipe(
        map<any, Actions>(payload => ({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload
        })),
        catchError(payload =>
          of<Actions>({ type: AuthActionTypes.LOGIN_FAILURE, payload })
        )
      );
    })
  );

const logoutEpic: AuthEpic = action$ =>
  action$.pipe(
    ofType<Actions, Logout>(AuthActionTypes.LOGOUT),
    switchMap(() =>
      from(logout()).pipe(
        mergeMap(() =>
          merge<Actions>(
            // of<Actions>(replace(PATHS.LOGIN, {})),
            of<Actions>({ type: AuthActionTypes.LOGOUT_SUCCESS })
          )
        ),
        catchError(() => of<Actions>({ type: AuthActionTypes.LOGOUT_FAILURE }))
      )
    )
  );

export default [loginEpic, logoutEpic];
