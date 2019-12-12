import { createCRUDReducerEx } from '../redux-crud-ex';
import { Schema$Product } from '../../typings';

const pageSize = 12;

const { crudReducerEx } = createCRUDReducerEx<Schema$Product, 'id'>({
  key: 'id',
  pageSize,
  ids: new Array(pageSize).fill(null),
  list: new Array(pageSize).fill({})
});

export default crudReducerEx;
