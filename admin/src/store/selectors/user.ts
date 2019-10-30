import { RootState } from '../reducers';

export const userListSelector = (state: RootState) => state.user.list;
