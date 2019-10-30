import { api } from './api';
import { Response$User } from '../typings';

export const getUsers = () => api.get<Response$User>('/user/list');

export const createUser = () => api.post('/user/add');
