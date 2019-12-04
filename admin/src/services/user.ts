import { api } from './api';
import { Param$CreateUser, Param$UpdateUser, Response$User } from '../typings';

export const getUsers = () => api.get<Response$User>('/user');

export const createUser = (params: Param$CreateUser) =>
  api.post('/user', params);

export const updateUser = (params: Param$UpdateUser) =>
  api.patch('/user', params);
