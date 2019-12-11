import { createCRUDReducerEx } from '../redux-crud-ex';
import { Schema$User } from '../../typings';

const { crudReducerEx } = createCRUDReducerEx<Schema$User, 'id'>({
  key: 'id',
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
