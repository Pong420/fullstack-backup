import {
  Param$GetUsers,
  Param$User,
  Response$GetUsers
} from '@fullstack/typings';
import { api } from './api';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>('/user', { params });

export const deleteUser = ({ id }: Param$User) =>
  api.delete<unknown>(`/user/${id}`);
