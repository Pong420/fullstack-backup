import { Schema$User } from '../../typings';
import { useActions } from '../../hooks/useActions';
import { CRUDActionsTypes } from '../createCRUDReducer';

export enum UserActionTypes {
  CREATE = 'CREATE_USER',
  DELETE = 'DELETE_USER',
  UPDATE = 'UPDATE_USER',
  RESET = 'RESET_USERS',
  PAGINATE = 'PAGINATE_USER',
  SET_PAGE = 'SET_PAGE_USER'
}

type Actions = CRUDActionsTypes<Schema$User, 'id'>;

export interface CreateUser {
  type: UserActionTypes.CREATE;
  payload: Actions['CREATE']['payload'];
}

export interface DeleteUser {
  type: UserActionTypes.DELETE;
  payload: Actions['DELETE']['payload'];
}

export interface UpdateUser {
  type: UserActionTypes.UPDATE;
  payload: Actions['UPDATE']['payload'];
}

export interface PaginateUser {
  type: UserActionTypes.PAGINATE;
  payload: Actions['PAGINATE']['payload'];
}

export interface SetPage {
  type: UserActionTypes.SET_PAGE;
  payload: Actions['SET_PAGE']['payload'];
}

export interface ResetUsers {
  type: UserActionTypes.RESET;
}

export type UserActions =
  | CreateUser
  | DeleteUser
  | UpdateUser
  | PaginateUser
  | SetPage
  | ResetUsers;

export function createUser(payload: CreateUser['payload']): CreateUser {
  return {
    type: UserActionTypes.CREATE,
    payload
  };
}

export function paginateUser(payload: PaginateUser['payload']): PaginateUser {
  return {
    type: UserActionTypes.PAGINATE,
    payload
  };
}

export function setPage(payload: SetPage['payload']): SetPage {
  return {
    type: UserActionTypes.SET_PAGE,
    payload
  };
}

export function deleteUser(payload: DeleteUser['payload']): DeleteUser {
  return {
    type: UserActionTypes.DELETE,
    payload
  };
}

export function updateUser(payload: UpdateUser['payload']): UpdateUser {
  return {
    type: UserActionTypes.UPDATE,
    payload
  };
}

export function resetUsers(): ResetUsers {
  return {
    type: UserActionTypes.RESET
  };
}

const actions = {
  createUser,
  deleteUser,
  updateUser,
  resetUsers,
  paginateUser,
  setPage
};

export const useUserActions = () => useActions(actions);
