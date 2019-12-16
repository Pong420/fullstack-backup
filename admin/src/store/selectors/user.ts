import { paginationSelector } from '@pong420/redux-crud';
import { RootState } from '../reducers';

export const userPaginationSelector = ({ pageNo }: { pageNo?: number }) => (
  state: RootState
) => paginationSelector({ ...state.user, ...(pageNo && { pageNo }) });
