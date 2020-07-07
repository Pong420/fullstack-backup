import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp, fastifyAdapter, NestFastifyApplication } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule.init(),
    fastifyAdapter()
  );

  const PORT = Number(process.env.PORT || 3000);

  await setupApp(app);

  await app.listen(PORT, '0.0.0.0');
}

bootstrap();
