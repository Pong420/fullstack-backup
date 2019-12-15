import { getCRUDActionCreatorEx, UnionCRUDActions } from '../redux-crud-ex';
import { Schema$Product, Response$GetSuggestion } from '../../typings';
import { useActions } from '../../hooks/useActions';

export enum ProductActionTypes {
  CREATE = 'CREATE_PRODUCT',
  DELETE = 'DELETE_PRODUCT',
  UPDATE = 'UPDATE_PRODUCT',
  RESET = 'RESET_PRODUCTS',
  PAGINATE = 'PAGINATE_PRODUCT',
  SET_PAGE = 'SET_PAGE_PRODUCT',
  SEARCH = 'SEARCH_PRODUCT',
  UPDATE_SUGGESSTION = 'UPDATE_SUGGESSTION'
}

export interface UpdateSuggestion {
  type: ProductActionTypes.UPDATE_SUGGESSTION;
  payload: {
    type: 'types' | 'tags';
    values: Response$GetSuggestion['data'];
  };
}

const crudActionsCreator = getCRUDActionCreatorEx<
  typeof ProductActionTypes,
  Schema$Product,
  'id'
>();

export const updateProductSuggestion = {
  updateSuggestion: (
    payload: UpdateSuggestion['payload']
  ): UpdateSuggestion => ({
    type: ProductActionTypes.UPDATE_SUGGESSTION,
    payload
  })
};

export const productActions = {
  createProduct: crudActionsCreator['CREATE'](ProductActionTypes.CREATE),
  deleteProduct: crudActionsCreator['DELETE'](ProductActionTypes.DELETE),
  updateProduct: crudActionsCreator['UPDATE'](ProductActionTypes.UPDATE),
  resetProducts: crudActionsCreator['RESET'](ProductActionTypes.RESET),
  paginateProduct: crudActionsCreator['PAGINATE'](ProductActionTypes.PAGINATE),
  setPageProduct: crudActionsCreator['SET_PAGE'](ProductActionTypes.SET_PAGE)
};

const search = crudActionsCreator['SEARCH'](ProductActionTypes.SEARCH);
export const searchProductActions = {
  search,
  clear: () => search('')
};

export type ProductActions =
  | UnionCRUDActions<typeof productActions>
  | UpdateSuggestion;

export const useProductActions = () => useActions(productActions);

export const useUpdateProductSuggestion = () =>
  useActions(updateProductSuggestion);

export const useSearchProduct = () => useActions(searchProductActions);
