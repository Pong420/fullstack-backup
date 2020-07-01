import { from, of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import {
  ExecutionContext,
  SetMetadata,
  CustomDecorator,
  Inject
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, JWTSignPayload } from '@fullstack/typings';
import { Expose, ExposeOptions } from 'class-transformer';
import { AuthService } from '../auth/auth.service';

type AccessType = keyof typeof UserRole | 'EVERYONE' | 'SELF' | 'PASSWORD';

export const Access = (...access: AccessType[]): CustomDecorator<string> =>
  SetMetadata('access', access);

export const Group = (
  groups: (keyof typeof UserRole)[],
  options?: ExposeOptions
): ReturnType<typeof Expose> => Expose({ groups, ...options });

export class AcessGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService
  ) {
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
      mergeMap<boolean, Promise<boolean>>(async active => {
        if (active) {
          const req = context.switchToHttp().getRequest<FastifyRequest>();
          const id: string | null = req.params?.id;
          const user: Partial<JWTSignPayload> = req.user || {};

          if (access.includes('PASSWORD')) {
            const payload = await this.authService
              .validateUser(user.username, req.body.password)
              .then(res => !!res);
            return !!payload;
          }

          if (access.includes('SELF') && id && id === user.user_id) return true;

          return access.length
            ? access.includes(UserRole[user.role] as AccessType)
            : true;
        }
        return false;
      })
    );
  }
}
