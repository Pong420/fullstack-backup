import { api } from './api';
import { Param$Login, Response$Login, Response$RefreshToken } from '../typings';

export const REFERTSH_TOKEN_PATH = '/auth/refresh_token';

export const login = (params: Param$Login) =>
  api.post<Response$Login>('/auth/login', params);

export const logout = () => api.post('/auth/logout');

export const refreshToken = () =>
  api.post<Response$RefreshToken>(REFERTSH_TOKEN_PATH);
