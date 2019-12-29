import { paginationSelector } from '@pong420/redux-crud';
import { RootState } from '../reducers';
import { Schema$Product } from '../../typings';
import { ProductSuggestTypes } from '../../service';

export const productPaginationSelector = (state: RootState) => {
  return paginationSelector(state.products);
};

export const productSelector = (id: string) => (
  state: RootState
): Partial<Schema$Product> => {
  return state.products.byIds[id] || {};
};

export const productSuggestSelector = (type: ProductSuggestTypes) => (
  state: RootState
) => state.products[type];
