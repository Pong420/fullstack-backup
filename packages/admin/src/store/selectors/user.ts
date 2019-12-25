import { paginationSelector } from '@pong420/redux-crud';
import { RootState } from '../reducers';

export const userPaginationSelector = (state: RootState) =>
  paginationSelector(state.user);
