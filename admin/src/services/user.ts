import { api } from './api';
import { Param$CreateUser, Response$User } from '../typings';

export const getUsers = () => api.get<Response$User>('/user/list');

export const createUser = (params: Param$CreateUser) =>
  api.post('/user/add', params);
