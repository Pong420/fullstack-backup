import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './utils/MongooseExceptionFilter';
import { ResponseInterceptor } from './utils/ResponseInterceptor';

export async function setupApp(app: INestApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
}
