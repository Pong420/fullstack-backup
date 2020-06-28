import { api } from './api';
import {
  Param$Login,
  Response$Login,
  Response$RefreshToken,
  Param$CreateUser,
  Response$User,
  UserRole
} from '@fullstack/typings';

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
