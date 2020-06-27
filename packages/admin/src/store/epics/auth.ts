import { of, merge, empty, defer } from 'rxjs';
import { switchMap, mergeMap, catchError, map } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import { Location } from 'history';
import { AuthActions, AuthActionMap, AuthActionTypes } from '../actions/auth';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';
import { login, refreshToken } from '../../service';

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
        catchError(() => of<Actions>({ type: AuthActionTypes.FAILURE }))
      );
    })
  );

export default [loginEpic];
