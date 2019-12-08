import { api } from './api';
import {
  Param$Login,
  Param$CreateUser,
  Response$Login,
  Response$RefreshToken,
  Response$CreateUser
} from '../typings';

export const REFERTSH_TOKEN_PATH = '/auth/refresh_token';

export const login = (params: Param$Login) =>
  api.post<Response$Login>('/auth/login', params);

export const register = (params: Param$CreateUser) =>
  api.post<Response$CreateUser>('/auth/register/admin', params);

export const logout = () => api.post('/auth/logout');

export const refreshToken = () =>
  api.post<Response$RefreshToken>(
    REFERTSH_TOKEN_PATH,
    {},
    {
      errorHandle: false
    }
  );
