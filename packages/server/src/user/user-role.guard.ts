import { ExecutionContext } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { AcessGuard } from '../utils/access.guard';

export class UserRoleGuard extends AcessGuard {
  canActivate(context: ExecutionContext): Observable<boolean> {
    const canActive = super.canActivate(context);
    const source$ =
      typeof canActive === 'boolean' ? of(canActive) : from(canActive);

    return source$.pipe(
      map(active => {
        if (active) {
          const request = context.switchToHttp().getRequest<FastifyRequest>();
          const currentRole = request.user.role;
          const targetRole = request.body?.role;
          return typeof targetRole === 'number'
            ? currentRole < targetRole
            : true;
        }
        return false;
      })
    );
  }
}
