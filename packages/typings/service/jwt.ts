import { UserRole } from './user';

export interface JWTSignPayload {
  user_id: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export interface JWTSignResult {
  token: string;
  expiry: Date | string;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
