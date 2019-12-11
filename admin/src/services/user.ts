import { api } from './api';
import {
  Param$GetUsers,
  Param$CreateUser,
  Param$UpdateUser,
  Response$GetUsers,
  Response$User
} from '../typings';
import { createFormData } from './createFormData';

export const getUsers = (params: Param$GetUsers = {}) =>
  api.get<Response$GetUsers>('/user/list', { params });

export const getUserInfo = (id?: string) => {
  return api.get<Response$User>(`/user` + (id ? `?id=${id}` : ''));
};

export const createUser = (params: Param$CreateUser) =>
  api.post<Response$User>('/user', createFormData(params));

export const updateUser = ({ id, password, ...params }: Param$UpdateUser) => {
  return api.patch<Response$User>(
    `/user/${id}`,
    createFormData({ ...(password && { password }), ...params })
  );
};

export const deleteUser = ({ id }: { id: string }) => {
  return api.delete(`/user/${id}`);
};
