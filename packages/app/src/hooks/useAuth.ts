import React, {
  useContext,
  useEffect,
  Reducer,
  ProviderProps,
  ReactNode
} from 'react';
import {
  JWTSignPayload,
  Param$Login,
  Schema$User,
  Param$CreateUser
} from '@fullstack/typings';
import { defer, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { login, logout, getJwtToken } from '../service';
import { toaster } from '../components/Toast';
import { register } from '@fullstack/common/service';

export type LoginStatus = 'unknown' | 'loading' | 'loggedIn' | 'required';

export interface LoggedIn {
  loginStatus: 'loggedIn';
  user: JWTSignPayload & Partial<Schema$User>;
}

export interface NotLoggedIn {
  loginStatus: Exclude<LoginStatus, LoggedIn['loginStatus']>;
  user: null;
}

type State = LoggedIn | NotLoggedIn;

type AuthenticatePayload = Param$Login | Param$CreateUser;

type Actions =
  | { type: 'AUTHENTICATE' }
  | { type: 'AUTHENTICATE_SUCCESS'; payload: LoggedIn['user'] }
  | { type: 'AUTHENTICATE_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_UPDATE'; payload: Partial<Schema$User> };

export type IAuthContext = State & {
  authenticate: (payload?: AuthenticatePayload) => void;
  logout: () => void;
};

const initialState: State = {
  loginStatus: 'unknown',
  user: null
};

const AuthContext = React.createContext({} as IAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = React.useReducer<Reducer<State, Actions>>(
    (prevState, action) => {
      switch (action.type) {
        case 'AUTHENTICATE':
          return {
            ...prevState,
            user: null,
            loginStatus: 'loading'
          };
        case 'AUTHENTICATE_SUCCESS':
          return {
            ...prevState,
            user: action.payload,
            loginStatus: 'loggedIn'
          };
        case 'AUTHENTICATE_FAILURE':
        case 'LOGOUT':
          return {
            ...prevState,
            user: null,
            loginStatus: 'required'
          };
        case 'PROFILE_UPDATE':
          return {
            ...prevState,
            loginStatus: 'loggedIn',
            user: {
              ...prevState.user,
              ...action.payload
            } as LoggedIn['user']
          };

        default:
          throw new Error('Incorrect action');
      }
    },
    initialState
  );

  const { loginStatus } = state;

  const authContext = React.useMemo<IAuthContext>(() => {
    const login$ = (payload: Param$Login) =>
      defer(() => login(payload)).pipe(
        map(res => res.data.data),
        catchError(error => {
          toaster.apiError('Login failure', error);
          return throwError(error);
        })
      );

    const authenticate$ = (payload?: AuthenticatePayload) =>
      payload
        ? 'email' in payload
          ? defer(() => register(payload)).pipe(
              switchMap(() => {
                toaster.success({ message: 'Registration Success' });
                return login$({
                  username: payload.username,
                  password: payload.password
                });
              }),
              catchError(error => {
                toaster.apiError('Registration failure', error);
                return throwError(error);
              })
            )
          : login$(payload)
        : getJwtToken();

    return {
      ...state,
      logout: () => {
        logout()
          .then(() => {
            toaster.success({ message: 'Logout success' });
            dispatch({ type: 'LOGOUT' });
          })
          .catch(error => toaster.apiError('Logout failure', error));
      },
      authenticate: payload => {
        dispatch({ type: 'AUTHENTICATE' });
        authenticate$(payload).subscribe(
          ({ user }) =>
            dispatch({ type: 'AUTHENTICATE_SUCCESS', payload: user }),
          () => dispatch({ type: 'AUTHENTICATE_FAILURE' })
        );
      }
    };
  }, [state]);

  const { authenticate } = authContext;

  useEffect(() => {
    if (loginStatus === 'unknown') {
      authenticate();
    }
  }, [loginStatus, authenticate]);

  return React.createElement<ProviderProps<IAuthContext>>(
    AuthContext.Provider,
    { value: authContext },
    children
  );
}
