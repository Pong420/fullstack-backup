import { ExecutionContext, CanActivate, Type, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { Schema$User } from '@fullstack/common/service/typings';
import { UserRole } from '../user/model/user.model';

export const UserLevels: UserRole[] = [
  UserRole.CLIENT,
  UserRole.GUEST,
  UserRole.MANAGER,
  UserRole.ADMIN
];

type Allow = 'higher' | 'equal' | 'self' | 'everyone';

export function hasPermission(
  user: Pick<Schema$User, 'username' | 'role'>,
  target: Pick<Schema$User, 'username' | 'role'> | undefined,
  allow: Allow[] = ['higher', 'equal']
) {
  const a = UserLevels.indexOf(user.role);
  const b = target ? UserLevels.indexOf(target.role) : -1;

  return (
    allow.includes('everyone') ||
    allow.some(type => {
      switch (type) {
        case 'higher':
          return a > b;
        case 'equal':
          return a === b;
        case 'self':
          return target ? user.username === target.username : false;
      }
    })
  );
}

export function RoleGuard(
  role: UserRole = UserRole.ADMIN,
  allow: Allow[] = ['higher', 'equal']
) {
  class RoleGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      const canActive = super.canActivate(context);
      const source$ =
        typeof canActive === 'boolean' ? of(canActive) : from(canActive);

      return source$.pipe(
        map(active => {
          if (active) {
            const req = context.switchToHttp().getRequest<FastifyRequest>();

            if (hasPermission(req.user, { username: '', role }, allow)) {
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
