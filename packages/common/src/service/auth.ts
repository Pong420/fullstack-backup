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

// jwtToken$ should only be defined after authentication
// and clear after logout
let jwtToken$: Observable<Schema$Authenticated> | null;

// mainly for account swtching
export function clearJwtToken() {
  jwtToken$ = null;
}

const refreshToken$ = (): Observable<Schema$Authenticated> =>
  defer(() => refreshToken()).pipe(
    map(res => res.data.data),
    shareReplay(1)
  );

export function getJwtToken() {
  return (jwtToken$ || refreshToken$()).pipe(
    switchMap(payload => {
      const expired = +new Date(payload.expiry) - +new Date() <= 30 * 1000;
      jwtToken$ = expired ? refreshToken$() : jwtToken$ || of(payload);
      return jwtToken$;
    })
  );
}

api.interceptors.request.use(async config => {
  // attach jwtToken$ if defined
  if (jwtToken$) {
    const { token } = await getJwtToken().toPromise();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
