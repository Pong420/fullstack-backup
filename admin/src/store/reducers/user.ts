import { createCRUDReducer } from '../createCRUDReducer';
import { Schema$User } from '../../typings';

const { crudReducer } = createCRUDReducer<Schema$User, 'id'>({
  key: 'id'
});

export default crudReducer;
