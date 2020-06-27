import { JWTSignResult, JWTSignPayload } from './jwt';
import { ApiResponse } from './index';

export interface Param$Login {
  username: string;
  password: string;
}

export type Response$Login = ApiResponse<
  JWTSignResult & { user: JWTSignPayload; isDefaultAc: boolean }
>;
