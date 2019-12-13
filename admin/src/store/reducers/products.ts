import { createCRUDReducerEx } from '../redux-crud-ex';
import { Schema$Product } from '../../typings';
import { ProductActionTypes } from '../actions';

const pageSize = 12;

const { crudReducerEx } = createCRUDReducerEx<Schema$Product, 'id'>({
  key: 'id',
  actions: ProductActionTypes,
  pageSize,
  ids: new Array(pageSize).fill(null),
  list: new Array(pageSize).fill({})
});

export default crudReducerEx;
