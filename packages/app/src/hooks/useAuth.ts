import React, {
  useContext,
  useEffect,
  Reducer,
  ProviderProps,
  ReactNode
} from 'react';
import {
  JWTSignPayload,
  Param$Authenticated,
  Schema$User,
  Param$RefreshToken
} from '@fullstack/typings';
import { defer, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { login, logout, getJwtToken } from '../service';
import { toaster } from '../components/Toast';

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

type Actions =
  | { type: 'AUTHORIZE'; payload?: Param$Authenticated | Param$RefreshToken }
  | { type: 'AUTHORIZE_SUCCESS'; payload: LoggedIn['user'] }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_UPDATE'; payload: Partial<Schema$User> };

export type IAuthContext = State & {
  authorize: (payload?: Param$Authenticated) => void;
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
        case 'AUTHORIZE':
          return {
            ...prevState,
            user: null,
            loginStatus: 'loading'
          };
        case 'AUTHORIZE_SUCCESS':
          return {
            ...prevState,
            user: action.payload,
            loginStatus: 'loggedIn'
          };
        case 'AUTH_FAILURE':
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
    const authorize$ = (payload?: Param$Authenticated) =>
      payload
        ? defer(() => login(payload)).pipe(
            map(res => res.data.data),
            catchError(error => {
              toaster.apiError('Login failure', error);
              return throwError(error);
            })
          )
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
      authorize: payload => {
        dispatch({ type: 'AUTHORIZE', payload });
        authorize$(payload).subscribe(
          ({ user }) => dispatch({ type: 'AUTHORIZE_SUCCESS', payload: user }),
          () => dispatch({ type: 'AUTH_FAILURE' })
        );
      }
    };
  }, [state]);

  const { authorize } = authContext;

  useEffect(() => {
    if (loginStatus === 'unknown') {
      authorize();
    }
  }, [loginStatus, authorize]);

  return React.createElement<ProviderProps<IAuthContext>>(
    AuthContext.Provider,
    { value: authContext },
    children
  );
}
