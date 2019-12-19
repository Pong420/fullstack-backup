import { UserRole } from '../../user';

export interface JWTSignPayload {
  id: string;
  username: string;
  role: UserRole;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
