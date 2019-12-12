import { getCRUDActionCreatorEx, UnionCRUDActions } from '../redux-crud-ex';
import { Schema$Product } from '../../typings';
import { useActions } from '../../hooks/useActions';

export enum ProductActionTypes {
  CREATE = 'CREATE_PRODUCT',
  DELETE = 'DELETE_PRODUCT',
  UPDATE = 'UPDATE_PRODUCT',
  RESET = 'RESET_PRODUCTS',
  PAGINATE = 'PAGINATE_PRODUCT',
  SET_PAGE = 'SET_PAGE_PRODUCT',
  SEARCH = 'SEARCH_PRODUCT'
}

const crudActionsCreator = getCRUDActionCreatorEx<
  typeof ProductActionTypes,
  Schema$Product,
  'id'
>();

const searchProduct = crudActionsCreator['SEARCH'](ProductActionTypes.SEARCH);

export const productActions = {
  createProduct: crudActionsCreator['CREATE'](ProductActionTypes.CREATE),
  deleteProduct: crudActionsCreator['DELETE'](ProductActionTypes.DELETE),
  updateProduct: crudActionsCreator['UPDATE'](ProductActionTypes.UPDATE),
  resetProducts: crudActionsCreator['RESET'](ProductActionTypes.RESET),
  paginateProduct: crudActionsCreator['PAGINATE'](ProductActionTypes.PAGINATE),
  setPageProduct: crudActionsCreator['SET_PAGE'](ProductActionTypes.SET_PAGE),
  searchProduct,
  clearSearchProduct: () => searchProduct('')
};

export type ProductActions = UnionCRUDActions<typeof productActions>;

export const useProductActions = () => useActions(productActions);
