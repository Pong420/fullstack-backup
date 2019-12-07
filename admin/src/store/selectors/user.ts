import { RootState } from '../reducers';
import { paginationSelector } from './shared';

export const userPaginationSelector = (state: RootState) =>
  paginationSelector(state.user);
