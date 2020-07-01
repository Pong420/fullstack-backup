import {
  Param$GetUsers,
  Param$User,
  Response$GetUsers,
  Param$UpdateUser,
  Response$User,
  Param$CreateUser
} from '@fullstack/typings';
import { api } from './api';
import { createFormData } from './createFormData';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>('/user', { params });

export const createUser = (payload: Param$CreateUser) =>
  api.post<Response$User>(`/user`, createFormData(payload));

export const updateUser = ({ id, ...payload }: Param$User & Param$UpdateUser) =>
  api.patch<Response$User>(`/user/${id}`, createFormData(payload));

export const deleteUser = ({ id }: Param$User) =>
  api.delete<unknown>(`/user/${id}`);

export const getUserProfile = ({ id }: Param$User) =>
  api.get<Response$User>(`/user/${id}`);
