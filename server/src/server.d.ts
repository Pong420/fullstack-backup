// eslint-disable-next-line
import * as fastify from 'fastify';
import typegoose, { DocumentType } from '@typegoose/typegoose';
import { PaginateModel } from 'mongoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

// mongoose.Pag

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user: any;
  }

  // eslint-disable-next-line
  interface FastifyReply<HttpResponse = DefaultBody> {}
}

declare module '@typegoose/typegoose' {
  export type ReturnPaginateModelType<
    U extends AnyParamConstructor<T>,
    T = any
  > = PaginateModelType<InstanceType<U>> & U;
  export type PaginateModelType<T> = PaginateModel<DocumentType<T>> & T;
}
