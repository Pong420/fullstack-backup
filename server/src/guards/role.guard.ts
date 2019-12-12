import { ExecutionContext, CanActivate, Type, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { ValidatePayload } from '../auth';
import { UserRole } from '../user/model/user.model';

export const UserLevels: UserRole[] = [
  UserRole.CLIENT,
  UserRole.GUEST,
  UserRole.MANAGER,
  UserRole.ADMIN
];

export function RoleGuard(role: UserRole = UserRole.ADMIN) {
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

            if (UserLevels.indexOf(user.role) >= UserLevels.indexOf(role)) {
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
