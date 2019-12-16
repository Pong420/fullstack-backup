// eslint-disable-next-line
import * as fastify from 'fastify';
import { DocumentType } from '@typegoose/typegoose';
import { PaginateModel } from 'mongoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { JWTSignPayload } from './auth';

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user: JWTSignPayload;
  }

  // eslint-disable-next-line
  interface FastifyReply<HttpResponse = DefaultBody> {}
}

declare module '@typegoose/typegoose' {
  export type ReturnPaginateModelType<
    U extends AnyParamConstructor<T>,
    T = any // eslint-disable-line
  > = PaginateModelType<InstanceType<U>> & U;
  export type PaginateModelType<T> = PaginateModel<DocumentType<T>> & T;
}
