import { createCRUDReducer } from '../createCRUDReducer';
import { Schema$User } from '../../typings';

const { crudReducer } = createCRUDReducer<Schema$User, 'id'>({
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

export default crudReducer;
