import {
  Param$Login,
  Response$Authenticated,
  Response$RefreshToken,
  Param$CreateUser,
  Response$User,
  UserRole,
  Schema$Authenticated,
  Param$DeleteAccount,
  Param$ModifyPassword
} from '@fullstack/typings';
import { defer, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { paths } from '../constants';
import { api } from './api';

export const login = (params: Param$Login) =>
  api.post<Response$Authenticated>(paths.login, params);

export const refreshToken = () =>
  api.post<Response$RefreshToken>(paths.refresh_token, {});

export const register = (params: Param$CreateUser) =>
  api.post<Response$User>(paths.registration, {
    ...params,
    role: UserRole.CLIENT
  });

export const registerAdmin = (params: Param$CreateUser) =>
  api.post<Response$User>(paths.admin_registration, {
    ...params,
    role: UserRole.ADMIN
  });

export const registerGuest = (params: Param$CreateUser) =>
  api.post<Response$User>(paths.guest_registration, {
    ...params,
    role: UserRole.GUEST
  });

export const logout = () => api.post<unknown>(paths.logout);

export const deleteAccount = (data: Param$DeleteAccount) =>
  api.delete<unknown>(paths.delete_account, { data });

export const modifyPassword = (payload: Param$ModifyPassword) =>
  api.patch<unknown>(paths.modify_password, payload);

// ---------

let jwtToken$: Observable<Schema$Authenticated> | null = null;

export function clearJwtToken() {
  jwtToken$ = null;
}

export const authenticate$ = (
  payload?: Param$Login
): Observable<Schema$Authenticated> =>
  (payload ? defer(() => login(payload)) : defer(() => refreshToken())).pipe(
    map(res => res.data.data),
    shareReplay(1)
  );

export function getJwtToken(payload?: Param$Login) {
  return (jwtToken$ || authenticate$(payload)).pipe(
    switchMap(payload => {
      const expired = +new Date(payload.expiry) - +new Date() <= 30 * 1000;
      jwtToken$ = expired ? authenticate$() : jwtToken$ || of(payload);
      return jwtToken$;
    })
  );
}

const excludeAuthUrls = [
  paths.login,
  paths.refresh_token,
  paths.registration,
  paths.guest_registration
];
const authUrlRegex = new RegExp(
  `(${excludeAuthUrls.join('|').replace(/\//g, '\\/')})$`
);

const isAuthUrl = (url?: string) => url && authUrlRegex.test(url);

api.interceptors.request.use(async config => {
  if (!isAuthUrl(config.url) && jwtToken$) {
    const { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
