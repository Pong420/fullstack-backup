import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserRole, JWTSignPayload } from '@fullstack/typings';

export const User = createParamDecorator(
  (_data: unknown = [], ctx: ExecutionContext): JWTSignPayload => {
    const reqeust: FastifyRequest = ctx.switchToHttp().getRequest();
    return reqeust.user;
  }
);

export interface UserId {
  user?: string;
}

export const UserId = createParamDecorator(
  (data: UserRole[] = [], ctx: ExecutionContext): UserId => {
    const reqeust: FastifyRequest = ctx.switchToHttp().getRequest();
    const user: JWTSignPayload = reqeust.user;
    if (data.length && !data.includes(user.role)) {
      return {};
    }
    return { user: user.user_id };
  }
);
