import { Timestamp } from './index';
import { JWTSignPayload } from './jwt';

export interface Param$CreateRefreshToken extends JWTSignPayload {
  refreshToken: string;
}

export interface Schema$RefreshToken
  extends Param$CreateRefreshToken,
    Timestamp {
  id: string;
}
