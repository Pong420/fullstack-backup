import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function transformResponse<T, R>(data: T, reply: FastifyReply) {
  return {
    statusCode: reply.res.statusCode,
    data
  };
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const reply = http.getResponse<FastifyReply>();

    return next.handle().pipe(map(data => transformResponse(data, reply)));
  }
}
