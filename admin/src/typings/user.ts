import {
  Param$Search,
  Param$Pagination,
  Response$API,
  Response$PaginationAPI
} from '.';
import {
  Schema$User,
  Required$CreateUser,
  Required$UpdateUser
} from '@fullstack/typings';

export interface Param$GetUsers extends Param$Search, Param$Pagination {}

export interface Param$CreateUser extends Required$CreateUser {
  avatar?: File | null;
}

export interface Param$UpdateUser extends Required$UpdateUser {
  id: string;
  avatar?: File | null;
}

export type Response$User = Response$API<Schema$User>;

export type Response$GetUsers = Response$PaginationAPI<Schema$User>;
