import { INestApplication } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';

export async function setupApp(app: INestApplication): Promise<void> {
  app.useGlobalInterceptors(new ResponseInterceptor());
}
