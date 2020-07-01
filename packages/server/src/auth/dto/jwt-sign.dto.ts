import { JWTSignPayload, UserRole } from '@fullstack/typings';
import { classToPlain, Expose } from 'class-transformer';

export class JWTSignDto implements JWTSignPayload {
  @Expose()
  user_id: string;

  @Expose()
  username: string;

  @Expose()
  nickname: string;

  @Expose()
  role: UserRole;

  constructor(payload: Partial<JWTSignDto>) {
    Object.assign(this, payload);
  }
}

export const formatJWTSignPayload = <T extends JWTSignPayload>(
  payload: T
): JWTSignPayload =>
  classToPlain(new JWTSignDto(payload), {
    strategy: 'excludeAll'
  }) as JWTSignPayload;
