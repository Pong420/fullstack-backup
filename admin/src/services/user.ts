import { api } from './api';
import { Param$Login } from '../typings';

export const login = (params: Param$Login) => api.post('/auth/login', params);
