import { of, merge, empty, defer, fromEvent, race, throwError } from 'rxjs';
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
import { logout, getJwtToken, clearJwtToken } from '@fullstack/common/service';
import { Location } from 'history';
import { AuthActions, AuthActionMap, AuthActionTypes } from '../actions/auth';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';
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
    ofType<Actions, AuthActionMap['AUTHENTICATE']>(
      AuthActionTypes.AUTHENTICATE
    ),
    switchMap(action => {
      return getJwtToken(action.payload).pipe(
        catchError(error => {
          action.payload && Toaster.apiError('Login failure', error);
          return throwError(error);
        }),
        mergeMap(payload => {
          const { location } = state$.value.router;
          const redirect = payload.isDefaultAc
            ? PATHS.ADMIN_REGISTRATION
            : isLocation(location.state)
            ? location.state.pathname + location.state.search
            : location.pathname === PATHS.LOGIN
            ? PATHS.HOME
            : undefined;

          return merge<Actions>(
            of({ type: AuthActionTypes.SCCUESS, payload: payload.user }),
            redirect ? of<Actions>(replace(redirect, {})) : empty()
          );
        }),
        catchError(() => of<Actions>({ type: AuthActionTypes.FAILURE }))
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
          Toaster.apiError('Logout failure', error);
          return empty();
        })
      );
    })
  );

  return race(logoutEvent$, logoutApi$).pipe(
    map<unknown, Actions>(() => replace(PATHS.LOGIN)),
    tap(() => clearJwtToken())
  );
};

export default [loginEpic, logoutEpic];
