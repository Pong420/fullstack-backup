import { api } from './api';
import { Param$Login } from '../typings';

export const login = (params: Param$Login) => api.post('/auth/login', params);

export const refreshToken = () => api.post('/auth/refresh_token');

export const logout = () => api.post('/auth/logout');
