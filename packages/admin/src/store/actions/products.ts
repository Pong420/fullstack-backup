import { createCRUDActions, UnionCRUDActions } from '@pong420/redux-crud';
import { Schema$Product, Response$GetSuggestion } from '../../typings';
import { ProductSuggestTypes } from '../../service';
import { useActions } from '../';

const [productActions, defaultProductActionTypes] = createCRUDActions<
  Schema$Product,
  'id'
>()({
  createProduct: ['CREATE', 'CREATE_PRODUCT'],
  deleteProduct: ['DELETE', 'DELETE_PRODUCT'],
  updateProduct: ['UPDATE', 'UPDATE_PRODUCT'],
  paginateProduct: ['PAGINATE', 'PAGINATE_PRODUCT']
});

export const ProductActionTypes = {
  ...defaultProductActionTypes,
  UPDATE_SUGGESSTION: 'UPDATE_SUGGESSTION' as const
};

function updateSuggestion(payload: {
  type: ProductSuggestTypes;
  values: Response$GetSuggestion['data'];
}) {
  return {
    type: ProductActionTypes.UPDATE_SUGGESSTION,
    payload
  };
}

export type UpdateSuggestion = ReturnType<typeof updateSuggestion>;

export type ProductActions =
  | UnionCRUDActions<typeof productActions>
  | UpdateSuggestion;

export const useProductActions = () => useActions(productActions);

export const useUpdateProductSuggestion = () =>
  useActions({ updateSuggestion });
