import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from '../app.module';
import { ConfigService, ConfigModule } from '../config';
import { mongoConnection } from './database.providers';
import { UserRole, UserService, UserModule } from '../user';

const rid = (N = 5) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: N }, () =>
    s.charAt(Math.floor(Math.random() * s.length))
  ).join('');
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app
    .select(ConfigModule)
    .get(ConfigService, { strict: true });
  const userService = app.select(UserModule).get(UserService, { strict: true });

  const MONGODB_URI = configService.get('MONGODB_URI');

  if (MONGODB_URI) {
    const mongoose = await mongoConnection(MONGODB_URI);

    for (let i = 0; i < 50; i++) {
      await userService.create({
        username: rid(8),
        password: rid(8),
        nickname: rid(5),
        email: `${rid(8)}@gmail.com`,
        role: UserRole.CLIENT
      });

      console.log(i);
    }

    console.log('done');

    await mongoose.disconnect();
    await app.close();

    process.exit();
  }
}

bootstrap();
