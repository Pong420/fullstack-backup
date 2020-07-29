import { NestFactory } from '@nestjs/core';
import { paths } from '@fullstack/common/constants';
import { AppModule } from './app.module';
import { setupApp, fastifyAdapter, NestFastifyApplication } from './setup';
import rateLimit from 'fastify-rate-limit';
import helmet from 'fastify-helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.init(),
    fastifyAdapter()
  );

  const PORT = Number(process.env.PORT || 3000);

  setupApp(app);

  app.setGlobalPrefix(paths.base_url);

  app.register(helmet);
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  await app.listen(PORT, '0.0.0.0');

  // eslint-disable-next-line
  console.log(`server listening on port ${PORT}`);
}

bootstrap();
