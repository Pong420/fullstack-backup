import { Param$GetUsers, Response$GetUsers } from '@fullstack/typings';
import { api } from './api';

export const getUsers = (params: Param$GetUsers) =>
  api.get<Response$GetUsers>('/user', { params });
