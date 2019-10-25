import { RootState } from '../reducers';

export const loginStatusSelector = (state: RootState) => state.user.loginStatus;
