import cookieParser from 'fastify-cookie';
import multipart from 'fastify-multipart';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { MongooseExceptionFilter } from './utils/mongoose-exception-filter';
import { ResponseInterceptor } from './utils/response.interceptor';
import qs from 'qs';

export { NestFastifyApplication };

export const fastifyAdapter = (): FastifyAdapter =>
  new FastifyAdapter({
    querystringParser: qs.parse
  });

export function setupApp(app: NestFastifyApplication): void {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.register(cookieParser);
  app.register(multipart);
}
