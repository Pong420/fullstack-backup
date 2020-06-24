import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from './app.module';
import { setupApp } from './setup';
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

      this.global.app = app;
      this.global.request = supertest(app.getHttpServer());
    } catch (error) {
      console.error(error);
      await this.mongod.stop();
    }
  }

  async teardown(): Promise<void> {
    await this.mongod.stop();
    await this.global.app.close();
    await super.teardown();
  }
}
