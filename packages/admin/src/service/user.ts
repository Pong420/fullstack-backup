import {
  Param$GetUsers,
  Param$User,
  Response$GetUsers,
  Param$UpdateUser,
  Response$User
} from '@fullstack/typings';
import { api } from './api';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>('/user', { params });

export const updateUser = ({ id, ...changes }: Param$User & Param$UpdateUser) =>
  api.patch<Response$User>(`/user/${id}`, changes);

export const deleteUser = ({ id }: Param$User) =>
  api.delete<unknown>(`/user/${id}`);
