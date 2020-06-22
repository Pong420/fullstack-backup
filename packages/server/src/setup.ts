import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './utils/ExceptionFilter';
import { ResponseInterceptor } from './utils/ResponseInterceptor';

export async function setupApp(app: INestApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
}
