import { api } from './api';
import {
  Param$GetUsers,
  Param$CreateUser,
  Param$UpdateUser,
  Response$GetUsers,
  Response$User
} from './typings';
import { createFormData, generatePath, PATHS } from './utils';

export const getUsers = (params: Param$GetUsers = {}) =>
  api.get<Response$GetUsers>(PATHS.GET_USERS, { params });

export const getUserInfo = (id?: string) =>
  api.get<Response$User>(generatePath(PATHS.GET_USER, { id }));

export const createUser = (params: Param$CreateUser) =>
  api.post<Response$User>(PATHS.CREATE_USER, createFormData(params));

export const updateUser = ({ id, password, ...params }: Param$UpdateUser) => {
  return api.patch<Response$User>(
    generatePath(PATHS.UPDATE_USER, { id }),
    createFormData({ ...(password && { password }), ...params })
  );
};

export const deleteUser = ({ id }: { id: string }) => {
  return api.delete(generatePath(PATHS.DELETE_USER, { id }));
};
