import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { createMemoSelector } from '../../utils/createMemoSelector';

interface Props$UserId {
  id: string;
}

export const userListSelector = (state: RootState) => state.user.list;

export const userIdsSelector = (state: RootState) => state.user.ids;

export const userByIdsSelector = (state: RootState) => state.user.byIds;

export const userSelector = createSelector(
  userByIdsSelector,
  (_: RootState, { id }: Props$UserId) => id,
  (byIds, id) => byIds[id]
);

export const useUserSelector = createMemoSelector(userSelector);
