import { api } from './api';
import {
  Param$Login,
  Response$Login,
  Response$RefreshToken
} from '@fullstack/typings';

export const login = (params: Param$Login) =>
  api.post<Response$Login>('/auth/login', params);

export const refreshToken = () =>
  api.post<Response$RefreshToken>('/auth/refresh-token', {});
