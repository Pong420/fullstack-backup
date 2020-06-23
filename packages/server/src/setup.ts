import cookieParser from 'fastify-cookie';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MongooseExceptionFilter } from './utils/MongooseExceptionFilter';
import { ResponseInterceptor } from './utils/ResponseInterceptor';

export async function setupApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api');
  app.register(cookieParser);
}
