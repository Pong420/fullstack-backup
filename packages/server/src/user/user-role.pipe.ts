import { REQUEST } from '@nestjs/core';
import { Inject, PipeTransform, ForbiddenException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserRole } from '@fullstack/typings';

export class UserRolePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: FastifyRequest
  ) {}

  async transform(value: unknown): Promise<unknown> {
    const currentRole = this.request?.user?.role;
    const targetRole = this.request.body?.role;

    if (typeof UserRole[targetRole] !== undefined) {
      if (currentRole >= targetRole) {
        throw new ForbiddenException();
      }
    }
    return value;
  }
}
