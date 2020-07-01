import { api } from './api';
import {
  Param$Login,
  Response$Login,
  Response$RefreshToken,
  Param$CreateUser,
  Response$User,
  UserRole,
  Schema$Login,
  Param$DeleteAccount,
  Param$ModifyPassword
} from '@fullstack/typings';
import { defer, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

export const login = (params: Param$Login) =>
  api.post<Response$Login>('/auth/login', params);

export const refreshToken = () =>
  api.post<Response$RefreshToken>('/auth/refresh-token', {});

export const registerAdmin = (params: Param$CreateUser) =>
  api.post<Response$User>('/auth/register/admin', {
    ...params,
    role: UserRole.ADMIN
  });

export const logout = () => api.post<unknown>('/auth/logout');

export const deleteAccount = (data: Param$DeleteAccount) =>
  api.delete<unknown>(`/auth/delete`, { data });

export const modifyPassword = (payload: Param$ModifyPassword) =>
  api.patch<unknown>(`/auth/modify-password`, payload);

let jwtToken$: Observable<Schema$Login> | null;

export function clearJwtToken() {
  jwtToken$ = null;
}

const refreshToken$ = (): Observable<Schema$Login> =>
  defer(() => refreshToken()).pipe(
    map(res => res.data.data),
    shareReplay(1)
  );

export function getJwtToken() {
  jwtToken$ = jwtToken$ || refreshToken$();
  return jwtToken$.pipe(
    switchMap(payload => {
      const expired = +new Date(payload.expiry) - +new Date() <= 30 * 1000;
      if (expired) {
        jwtToken$ = refreshToken$();
      }
      return jwtToken$ || of(payload);
    })
  );
}
