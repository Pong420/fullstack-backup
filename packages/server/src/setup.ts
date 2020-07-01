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

export const fastifyAdapter = new FastifyAdapter({
  querystringParser: qs.parse
});

export async function setupApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api');
  app.register(cookieParser);
  app.register(multipart);
}
