import { of, merge, empty, defer, fromEvent, race } from 'rxjs';
import {
  switchMap,
  mergeMap,
  catchError,
  map,
  tap,
  filter
} from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import { Location } from 'history';
import { AuthActions, AuthActionMap, AuthActionTypes } from '../actions/auth';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';
import { login, logout, refreshToken } from '../../service';
import { Toaster } from '../../utils/toaster';

type Actions = AuthActions | RouterAction;
type AuthEpic = Epic<Actions, Actions, RootState>;

function isLocation(object?: any): object is Location {
  return (
    object !== null &&
    typeof object === 'object' &&
    object.hasOwnProperty('pathname') &&
    object.hasOwnProperty('search')
  );
}

const loginEpic: AuthEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, AuthActionMap['AUTHORIZE']>(AuthActionTypes.AUTHORIZE),
    switchMap(action => {
      const request$ = defer(() =>
        action.payload ? login(action.payload) : refreshToken()
      ).pipe(map(res => res.data.data));

      return request$.pipe(
        mergeMap(payload => {
          const { location } = state$.value.router;
          const redirect = isLocation(location.state)
            ? location.state.pathname + location.state.search
            : location.pathname === PATHS.LOGIN
            ? PATHS.HOME
            : undefined;

          return merge<Actions>(
            of({ type: AuthActionTypes.SCCUESS, payload: payload.user }),
            payload.isDefaultAc
              ? empty()
              : redirect
              ? of<Actions>(replace(redirect, {}))
              : empty()
          );
        }),
        catchError(error =>
          of<Actions>({ type: AuthActionTypes.FAILURE }).pipe(
            tap(() => Toaster.apiError(error, 'Login failure'))
          )
        )
      );
    })
  );

const logoutEpic: AuthEpic = action$ => {
  const key = 'logout';

  // Sync log out if user logged in on the different tab
  // Note: StorageEvent is fired in different page with the same domain.
  const logoutEvent$ = fromEvent<StorageEvent>(window, 'storage').pipe(
    filter(event => event.key === key)
  );

  const logoutApi$ = action$.pipe(
    ofType<Actions, AuthActionMap['LOGOUT']>(AuthActionTypes.LOGOUT),
    switchMap(() => {
      return defer(() => logout()).pipe(
        tap(() => {
          localStorage.setItem(key, new Date().toISOString());
          Toaster.success({ message: 'Logout success' });
        }),
        catchError(error => {
          Toaster.apiError(error, 'Logout failure');
          return empty();
        })
      );
    })
  );

  return race(logoutEvent$, logoutApi$).pipe(
    map<unknown, Actions>(() => replace(PATHS.LOGIN))
  );
};

export default [loginEpic, logoutEpic];
