import {
  Param$GetUsers,
  Param$User,
  Response$GetUsers,
  Param$UpdateUser,
  Response$User,
  Param$CreateUser
} from '@fullstack/typings';
import { paths } from '../constants';
import { api } from './api';

const image: keyof Param$CreateUser & keyof Param$UpdateUser = 'avatar';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>(paths.get_users, { params });

export const createUser = (payload: Param$CreateUser) =>
  api.post<Response$User>(paths.create_user, payload, { image });

export const updateUser = ({ id, ...payload }: Param$User & Param$UpdateUser) =>
  api.patch<Response$User>(paths.update_user.generatePath({ id }), payload, {
    image
  });

export const deleteUser = ({ id }: Param$User) =>
  api.delete<unknown>(paths.delete_user.generatePath({ id }));

export const getUserProfile = ({ id }: Param$User) =>
  api.get<Response$User>(paths.get_user.generatePath({ id }));
