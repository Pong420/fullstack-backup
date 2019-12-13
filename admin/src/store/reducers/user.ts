import { createCRUDReducerEx } from '../redux-crud-ex';
import { Schema$User } from '../../typings';
import { UserActionTypes } from '../actions';

const { crudReducerEx } = createCRUDReducerEx<Schema$User, 'id'>({
  key: 'id',
  actions: UserActionTypes,
  pageSize: Math.max(
    10,
    Math.floor(
      (window.screen.height -
        (window.screen.height - window.innerHeight) -
        200) /
        65
    )
  )
});

export default crudReducerEx;
