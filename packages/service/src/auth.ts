import { api } from './api';
import {
  Param$Login,
  Param$CreateUser,
  Param$ModifyPassword,
  Param$DeleteAccount,
  Response$Login,
  Response$RefreshToken,
  Response$User
} from './typings';
import { PATHS } from './utils/paths';

export const login = (params: Param$Login) =>
  api.post<Response$Login>(PATHS.LOGIN, params);

export const adminRegistration = (params: Param$CreateUser) =>
  api.post<Response$User>(PATHS.ADMIN_REGISTRATION, params);

export const guestRegistration = (params: Param$CreateUser) =>
  api.post<Response$User>(PATHS.GUEST_REGISTRATION, params);

export const logout = () => api.post(PATHS.LOOUT);

export const refreshToken = () =>
  api.post<Response$RefreshToken>(
    PATHS.REFERTSH_TOKEN,
    {},
    {
      errorHandle: false
    }
  );

export const modifyPassword = (params: Param$ModifyPassword) =>
  api.patch<Response$User>(PATHS.MODIFY_PASSWORD, params);

export const deleteAcctount = (data: Param$DeleteAccount) =>
  api.delete(PATHS.DELETE_ACCOUNT, { data });
