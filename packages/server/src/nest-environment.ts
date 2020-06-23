import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import NodeEnvironment from 'jest-environment-node';

export default class NestNodeEnvironment extends NodeEnvironment {
  async setup(): Promise<void> {
    await super.setup();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    const app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );

    await setupApp(app);
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    this.global.app = app;
  }

  async teardown(): Promise<void> {
    await this.global.app.close();
    await super.teardown();
  }
}
