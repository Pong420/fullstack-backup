import {
  Param$GetUsers,
  Param$User,
  Response$GetUsers,
  Param$UpdateUser,
  Response$User,
  Param$CreateUser
} from '@fullstack/typings';
import { api } from './api';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>('/user', { params });

export const createUser = (payload: Param$CreateUser) =>
  api.post<Response$User>(`/user`, payload);

export const updateUser = ({ id, ...update }: Param$User & Param$UpdateUser) =>
  api.patch<Response$User>(`/user/${id}`, update);

export const deleteUser = ({ id }: Param$User) =>
  api.delete<unknown>(`/user/${id}`);
