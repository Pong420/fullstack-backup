import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';

export async function setupApp(app: INestApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
}
