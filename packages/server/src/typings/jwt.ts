import { UserRole } from '@fullstack/typings';

export interface JWTSignPayload {
  user_id: string;
  username: string;
  role: UserRole;
}

export interface JWTSignResult {
  token: string;
  expiry: Date;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
