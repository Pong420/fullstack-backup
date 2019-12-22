import { RootState } from '../reducers';

export const loginStatusSelector = (state: RootState) => state.auth.loginStatus;

export const authUserSelector = (state: RootState) => state.auth.user;
