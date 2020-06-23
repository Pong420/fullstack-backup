import { UserRole } from '@fullstack/typings';
import { User } from 'src/user/schemas/user.schema';

export interface JWTSignPayload {
  id: string;
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

export type ValidateResult = Pick<User, 'id' | 'username' | 'role'>;
