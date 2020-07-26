import { REQUEST } from '@nestjs/core';
import { Inject, PipeTransform } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export class AttachUserPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST)
    private readonly request: FastifyRequest
  ) {}

  async transform(value: unknown): Promise<unknown> {
    if (value && typeof value === 'object') {
      value['user'] = this.request.user.user_id;
    }
    return value;
  }
}
