import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { ConfigService } from '@nestjs/config';
import { login } from '../test/utils/login';
import NodeEnvironment from 'jest-environment-node';
import supertest from 'supertest';

export default class NestNodeEnvironment extends NodeEnvironment {
  mongod = new MongoMemoryServer();

  async setup(): Promise<void> {
    await super.setup();
    try {
      const MONGODB_URI = await this.mongod.getUri();
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          AppModule.init([
            () => ({
              MONGODB_URI,
              NODE_ENV: 'production',
              JWT_TOKEN_EXPIRES_IN_MINUTES: 1,
              REFRESH_TOKEN_EXPIRES_IN_MINUTES: 1
            })
          ])
        ]
      }).compile();

      const app = moduleFixture.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter()
      );

      await setupApp(app);
      await app.init();
      await app.getHttpAdapter().getInstance().ready();

      const configService = app.get<ConfigService>(ConfigService);

      this.global.app = app;
      this.global.request = supertest(app.getHttpServer());
      this.global.loginAsDefaultAdmin = () =>
        login({
          username: configService.get('DEFAULT_USERNAME'),
          password: configService.get('DEFAULT_PASSWORD')
        });
    } catch (error) {
      console.error(error);
      await this.mongod.stop();
    }
  }

  async teardown(): Promise<void> {
    await this.global.app.close();
    await this.mongod.stop();
    await super.teardown();
  }
}
