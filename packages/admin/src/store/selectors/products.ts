import { paginationSelectorEx } from '../redux-crud-ex';
import { RootState } from '../reducers';
import { Schema$Product } from '../../typings';

export const productPaginationSelector = (state: RootState) => {
  return paginationSelectorEx<Schema$Product, 'id'>(state.products);
};

export const productSelector = (id: string) => (
  state: RootState
): Partial<Schema$Product> => {
  return id ? state.products.byIds[id] : {};
};

export const productSuggestSelector = (type: 'types' | 'tags') => (
  state: RootState
) => state.products[type];
