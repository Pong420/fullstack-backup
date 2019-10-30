import { api } from './api';
import { Param$CreateUser, Param$UpdateUser, Response$User } from '../typings';

export const getUsers = () => api.get<Response$User>('/user/list');

export const createUser = (params: Param$CreateUser) =>
  api.post('/user/add', params);

export const updateUser = (params: Param$UpdateUser) =>
  api.post('/user/update', params);
