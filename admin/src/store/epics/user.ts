import { from, of, merge, empty } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import {
  UserActions,
  UserActionTypes,
  Login,
  RefreshToken,
  Logout
} from '../actions/user';
import { RootState } from '../reducers';
import { login, refreshToken, logout } from '../../services';
import { PATHS } from '../../constants';
import { Toaster } from '../../utils/toaster';
import { isLocation } from '../../utils/isLocation';

type Actions = UserActions | RouterAction;
type UserEpic = Epic<Actions, Actions, RootState>;

const loginEpic: UserEpic = (action$, state$) =>
  action$.pipe(
    ofType<Actions, Login | RefreshToken>(
      UserActionTypes.LOGIN,
      UserActionTypes.REFRESH_TOKEN
    ),
    switchMap(action => {
      const request =
        action.type === UserActionTypes.LOGIN
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
            of({ type: UserActionTypes.LOGIN_SUCCESS }),
            redirect ? of<Actions>(replace(redirect, {})) : empty()
          );
        }),
        catchError(payload => {
          action.type === UserActionTypes.LOGIN && Toaster.apiError(payload);
          return of<Actions>({ type: UserActionTypes.LOGIN_FAILURE, payload });
        })
      );
    })
  );

const logoutEpic: UserEpic = action$ =>
  action$.pipe(
    ofType<Actions, Logout>(UserActionTypes.LOGOUT),
    switchMap(() =>
      from(logout()).pipe(
        mergeMap(() =>
          merge<Actions>(
            of<Actions>(replace(PATHS.LOGIN, {})),
            of<Actions>({ type: UserActionTypes.LOGOUT_SUCCESS })
          )
        ),
        catchError(() => of<Actions>({ type: UserActionTypes.LOGOUT_FAILURE }))
      )
    )
  );

export default [loginEpic, logoutEpic];
