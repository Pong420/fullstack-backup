import { paginationSelectorEx } from '../redux-crud-ex';
import { RootState } from '../reducers';

export const userPaginationSelector = (state: RootState) =>
  paginationSelectorEx(state.user);
