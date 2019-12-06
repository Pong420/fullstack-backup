import { api } from './api';
import {
  Param$CreateUser,
  Param$UpdateUser,
  Response$GetUsers,
  Response$GetUserInfo,
  Response$CreateUser,
  Response$UpdateUser
} from '../typings';

export const getUsers = () => api.get<Response$GetUsers>('/user/list');

export const getUserInfo = (id?: string) => {
  return api.get<Response$GetUserInfo>(`/user` + (id ? `?id=${id}` : ''));
};

export const createUser = (params: Param$CreateUser) =>
  api.post<Response$CreateUser>('/user', params);

export const updateUser = ({ id, ...params }: Param$UpdateUser) => {
  return api.patch<Response$UpdateUser>(`/user/${id}`, params);
};
