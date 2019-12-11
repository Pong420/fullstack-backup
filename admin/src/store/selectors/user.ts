import { RootState } from '../reducers';
import { paginationAndSearchSelector } from '../redux-crud-ex';

export const userPaginationSelector = (state: RootState) =>
  paginationAndSearchSelector(state.user);
