import { api } from './api';
import {
  Param$CreateUser,
  Param$UpdateUser,
  Response$GetUsers,
  Response$CreateUser
} from '../typings';

export const getUsers = () => api.get<Response$GetUsers>('/user');

export const createUser = (params: Param$CreateUser) =>
  api.post<Response$CreateUser>('/user', params);

export const updateUser = (params: Param$UpdateUser) =>
  api.patch('/user', params);
