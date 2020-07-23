import { Timestamp, ApiResponse } from './index';
import { JWTSignPayload } from './jwt';
import { Schema$Authenticated } from './auth';

export interface Param$CreateRefreshToken extends JWTSignPayload {
  refreshToken: string;
}

export interface Schema$RefreshToken
  extends Param$CreateRefreshToken,
    Timestamp {
  id: string;
}

export type Response$RefreshToken = ApiResponse<Schema$Authenticated>;
