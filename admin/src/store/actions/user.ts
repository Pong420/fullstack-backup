import { Schema$User } from '../../typings';
import { useActions } from '../../hooks/useActions';
import { CRUDActionsTypes } from '../createCRUDReducer';

export enum UserActionTypes {
  ADD = 'ADD_USER',
  PAGINATE = 'PAGINATE_USER',
  SET_PAGE = 'SET_PAGE_USER',
  REMOVE = 'REMOVE_USER',
  UPDATE = 'UPDATE_USER',
  RESET = 'RESET_USERS'
}

type Actions = CRUDActionsTypes<Schema$User, 'id'>;

export interface AddUser {
  type: UserActionTypes.ADD;
  payload: Actions['ADD']['payload'];
}

export interface AddUserByPage {
  type: UserActionTypes.PAGINATE;
  payload: Actions['PAGINATE']['payload'];
}

export interface SetPage {
  type: UserActionTypes.SET_PAGE;
  payload: Actions['SET_PAGE']['payload'];
}

export interface RemoveUser {
  type: UserActionTypes.REMOVE;
  payload: Actions['REMOVE']['payload'];
}

export interface UpdateUser {
  type: UserActionTypes.UPDATE;
  payload: Actions['UPDATE']['payload'];
}

export interface ResetUsers {
  type: UserActionTypes.RESET;
}

export type UserActions =
  | AddUser
  | AddUserByPage
  | SetPage
  | RemoveUser
  | UpdateUser
  | ResetUsers;

export function addUser(payload: AddUser['payload']): AddUser {
  return {
    type: UserActionTypes.ADD,
    payload
  };
}

export function paginateUser(payload: AddUserByPage['payload']): AddUserByPage {
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

export function removeUser(payload: RemoveUser['payload']): RemoveUser {
  return {
    type: UserActionTypes.REMOVE,
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
  addUser,
  paginateUser,
  setPage,
  removeUser,
  updateUser,
  resetUsers
};

export const useUserActions = () => useActions(actions);
