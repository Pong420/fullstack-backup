import { api } from './api';
import {
  Param$Login,
  Param$CreateUser,
  Param$ModifyPassword,
  Param$DeleteAccount,
  Response$Login,
  Response$RefreshToken,
  Response$User
} from '../typings';

export const REFERTSH_TOKEN_PATH = '/auth/refresh_token';

export const login = (params: Param$Login) =>
  api.post<Response$Login>('/auth/login', params);

export const register = (params: Param$CreateUser) =>
  api.post<Response$User>('/auth/register/admin', params);

export const logout = () => api.post('/auth/logout');

export const refreshToken = () =>
  api.post<Response$RefreshToken>(
    REFERTSH_TOKEN_PATH,
    {},
    {
      errorHandle: false
    }
  );

export const modifyPassword = (params: Param$ModifyPassword) =>
  api.patch<Response$User>('/auth/modify-password', params);

export const deleteAcctount = (data: Param$DeleteAccount) =>
  api.delete('/auth/delete-account', { data });
