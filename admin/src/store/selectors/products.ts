import { RootState } from '../reducers';
import { paginationAndSearchSelector } from '../redux-crud-ex';

export const productPaginationSelector = (state: RootState) =>
  paginationAndSearchSelector(state.products);
