import { of, merge, empty, defer } from 'rxjs';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { RouterAction, replace } from 'connected-react-router';
import { AuthActions, AuthActionMap, AuthActionTypes } from '../actions/auth';
import { RootState } from '../reducers';
import { PATHS } from '../../constants';
import { Response$Login } from '@fullstack/typings';
import { Location } from 'history';
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
        action.payload
          ? login(action.payload).then(res => res.data.data)
          : refreshToken().then(res => {
              return {
                ...res.data.data,
                isDefaultAc: false,
                user: {}
              } as Response$Login['data'];
            })
      );

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
