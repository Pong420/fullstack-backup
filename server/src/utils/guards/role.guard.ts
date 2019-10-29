import { ExecutionContext, CanActivate, Type, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Role } from '../../typings';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidatePayload } from '../../auth';

export function RoleGuard(role: Role = Role.ADMIN) {
  class RoleGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      const canActive = super.canActivate(context);
      const source$ =
        typeof canActive === 'boolean' ? of(canActive) : from(canActive);

      return source$.pipe(
        map(active => {
          if (active) {
            const req = context.switchToHttp().getRequest<FastifyRequest>();
            const user = req.user as ValidatePayload;

            if (
              user.role === Role.ADMIN ||
              (user.role === role && user.username === req.body.username)
            ) {
              return true;
            }
          }

          return false;
        })
      );
    }
  }

  return mixin(RoleGuard) as Type<CanActivate>;
}
