import cookieParser from 'fastify-cookie';
import { Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { MongooseExceptionFilter } from './utils/MongooseExceptionFilter';
import { ResponseInterceptor } from './utils/ResponseInterceptor';
import { AcessGuard } from './utils/access.guard';
import { MongooseSerializerInterceptor } from './utils/MongooseSerializerInterceptor';
import qs from 'qs';

export { NestFastifyApplication };

export const fastifyAdapter = new FastifyAdapter({
  querystringParser: qs.parse
});

export async function setupApp(app: NestFastifyApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(
    new MongooseSerializerInterceptor(app.get(Reflector), app.get(JwtService))
  );
  app.useGlobalGuards(
    new AcessGuard(app.get(Reflector), app.get<ConfigService>(ConfigService))
  );
  app.setGlobalPrefix('api');
  app.register(cookieParser);
}
