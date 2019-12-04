import { UserRole } from '../../user';

export interface JWTSignPayload {
  username: string;
  role?: UserRole;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
