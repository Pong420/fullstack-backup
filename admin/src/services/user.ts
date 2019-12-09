import { api } from './api';
import {
  Param$Pagination,
  Param$CreateUser,
  Param$UpdateUser,
  Response$GetUsers,
  Response$GetUserInfo,
  Response$CreateUser,
  Response$UpdateUser
} from '../typings';
import { createFormData } from './createFormData';

export const getUsers = (params: Param$Pagination = {}) =>
  api.get<Response$GetUsers>('/user/list', { params });

export const getUserInfo = (id?: string) => {
  return api.get<Response$GetUserInfo>(`/user` + (id ? `?id=${id}` : ''));
};

export const createUser = (params: Param$CreateUser) =>
  api.post<Response$CreateUser>('/user', createFormData(params));

export const updateUser = ({ id, ...params }: Param$UpdateUser) => {
  return api.patch<Response$UpdateUser>(`/user/${id}`, createFormData(params));
};

export const deleteUser = ({ id }: { id: string }) => {
  return api.delete(`/user/${id}`);
};
