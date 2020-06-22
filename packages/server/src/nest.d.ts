// eslint-disable-next-line
import * as fastify from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    // eslint-disable-next-line
    user: any;
  }

  // eslint-disable-next-line
  interface FastifyReply<HttpResponse = DefaultBody> {}
}
