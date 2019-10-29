import { Role } from '../../typings';

export interface JWTSignPayload {
  username: string;
  role?: Role;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
