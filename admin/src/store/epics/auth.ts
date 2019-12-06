import { from, of, merge, empty } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import {
  AuthActions,
  AuthActionTypes,
  Login,
  RefreshToken,
  Logout
} from '../actions/auth';
import { RootState } from '../reducers';
import { login, refreshToken, logout } from '../../services';
import { PATHS } from '../../constants';
import { Toaster } from '../../utils/toaster';
import { isLocation } from '../../utils/isLocation';

type Actions = AuthActions | RouterAction;
type AuthEpic = Epic<Actions, Actions, RootState>;

const loginEpic: AuthEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, Login | RefreshToken>(
      AuthActionTypes.LOGIN,
      AuthActionTypes.REFRESH_TOKEN
    ),
    switchMap(action => {
      const request =
        action.type === AuthActionTypes.LOGIN
          ? login(action.payload)
          : refreshToken();

      return from(request).pipe(
        mergeMap(() => {
          const { location } = state$.value.router;
          const redirect = isLocation(location.state)
            ? location.state.pathname
            : location.pathname === PATHS.LOGIN
            ? PATHS.HOME
            : undefined;

          return merge<Actions>(
            of({ type: AuthActionTypes.LOGIN_SUCCESS }),
            redirect ? of<Actions>(replace(redirect, {})) : empty()
          );
        }),
        catchError(payload => {
          action.type === AuthActionTypes.LOGIN && Toaster.apiError(payload);
          return of<Actions>({ type: AuthActionTypes.LOGIN_FAILURE, payload });
        })
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
            of<Actions>(replace(PATHS.LOGIN, {})),
            of<Actions>({ type: AuthActionTypes.LOGOUT_SUCCESS })
          )
        ),
        catchError(() => of<Actions>({ type: AuthActionTypes.LOGOUT_FAILURE }))
      )
    )
  );

export default [loginEpic, logoutEpic];