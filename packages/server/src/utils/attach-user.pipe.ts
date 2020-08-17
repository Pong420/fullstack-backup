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
      const user_id = this.request?.user?.user_id;
      if (user_id) {
        value['user'] = user_id;
      }
    }
    return value;
  }
}
