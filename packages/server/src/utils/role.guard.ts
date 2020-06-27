import { from, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import { ExecutionContext, SetMetadata, CustomDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@fullstack/typings';
import { Expose, ExposeOptions } from 'class-transformer';

type AccessType = keyof typeof UserRole | 'EVERYONE' | 'SELF';

export const Access = (...access: AccessType[]): CustomDecorator<string> =>
  SetMetadata('access', access);

export const Group = (
  groups: (keyof typeof UserRole)[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });

export class RoleGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService
  ) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const access =
      this.reflector.getAllAndOverride<AccessType[]>('access', [
        context.getHandler(),
        context.getClass()
      ]) || [];

    if (
      access.includes('EVERYONE')
      // this.configService.get<string>('NODE_ENV') === 'development'
    ) {
      return of(true);
    }

    const canActive = super.canActivate(context);

    const source$ =
      typeof canActive === 'boolean' ? of(canActive) : from(canActive);

    return source$.pipe(
      map(active => {
        if (active) {
          const req = context.switchToHttp().getRequest<FastifyRequest>();
          const id: string | null = req.params?.id;
          const user = req.user || {};

          if (access.includes('SELF') && id && id === user.id) return true;

          return access.length
            ? access.includes(UserRole[user.role] as AccessType)
            : true;
        }
        return false;
      })
    );
  }
}
