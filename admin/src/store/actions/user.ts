import { Schema$User } from '../../typings';

export enum UserActionTypes {
  ADD = 'ADD_USER',
  REMOVE = 'REMOVE_USER',
  UPDATE = 'UPDATE_USER',
  RESET = 'RESET_USERS'
}

export interface AddUser {
  type: UserActionTypes.ADD;
  payload: Schema$User | Schema$User[];
}

export interface RemoveUser {
  type: UserActionTypes.REMOVE;
  payload: Pick<Schema$User, 'username'>;
}

export interface UpdateUser {
  type: UserActionTypes.UPDATE;
  payload: Partial<Schema$User> & Pick<Schema$User, 'username'>;
}

export interface ResetUsers {
  type: UserActionTypes.RESET;
}

export type UserActions = AddUser | RemoveUser | UpdateUser | ResetUsers;

export function addUser(payload: AddUser['payload']): AddUser {
  return {
    type: UserActionTypes.ADD,
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
