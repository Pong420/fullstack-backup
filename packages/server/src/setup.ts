import cookieParser from 'fastify-cookie';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MongooseExceptionFilter } from './utils/MongooseExceptionFilter';
import { ResponseInterceptor } from './utils/ResponseInterceptor';
import { RoleGuard } from './utils/role.guard';

export async function setupApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new RoleGuard(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.register(cookieParser);
}
