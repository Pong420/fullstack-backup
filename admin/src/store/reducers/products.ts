import { createCRUDReducerEx } from '../redux-crud-ex';
import { Schema$Product } from '../../typings';

const { crudReducerEx } = createCRUDReducerEx<Schema$Product, 'id'>({
  key: 'id',
  pageSize: 10
});

export default crudReducerEx;
