import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { SERVICE_PATHS } from '@fullstack/common/service';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors';
import cookieParser from 'fastify-cookie';
import multipart from 'fastify-multipart';

const PORT = process.env.PORT || 5000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.register(multipart);
  app.register(cookieParser);

  app.setGlobalPrefix(SERVICE_PATHS.BASE_URL);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
