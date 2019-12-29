import { createCRUDActions, UnionCRUDActions } from '@pong420/redux-crud';
import { Schema$User } from '../../typings';
import { useActions } from '../';

export const [userActions, UserActionTypes] = createCRUDActions<
  Schema$User,
  'id'
>()({
  createUser: ['CREATE', 'CREATE_USER'],
  deleteUser: ['DELETE', 'DELETE_USER'],
  updateUser: ['UPDATE', 'UPDATE_USER'],
  paginateUser: ['PAGINATE', 'PAGINATE_USER']
});

export type UserActions = UnionCRUDActions<typeof userActions>;

export const useUserActions = () => useActions(userActions);
