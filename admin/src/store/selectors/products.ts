import { RootState } from '../reducers';
import { Schema$Product } from '../../typings';
import { paginationAndSearchSelector } from '../redux-crud-ex';

export const productPaginationSelector = (state: RootState) =>
  paginationAndSearchSelector(state.products);

export const productSelector = (id: string) => (
  state: RootState
): Partial<Schema$Product> => {
  return id ? state.products.byIds[id] : {};
};
