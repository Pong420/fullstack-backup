import { from, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { ExecutionContext, SetMetadata, CustomDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@fullstack/typings';

type AccessType = keyof typeof UserRole | 'EVERYONE';

export const Access = (...access: AccessType[]): CustomDecorator<string> =>
  SetMetadata('access', access);

export class RoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access =
      this.reflector.getAllAndOverride<AccessType[]>('access', [
        context.getHandler(),
        context.getClass()
      ]) || [];

    if (access.includes('EVERYONE')) {
      return of(true);
    }

    const canActive = super.canActivate(context);
    const source$ =
      typeof canActive === 'boolean' ? of(canActive) : from(canActive);

    return source$.pipe(
      map(active => {
        if (active) {
          const req = context.switchToHttp().getRequest<FastifyRequest>();

          return access.length
            ? access.includes(UserRole[req.user.role] as AccessType)
            : true;
        }
        return false;
      })
    );
  }
}
