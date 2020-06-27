import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Response } from 'superagent';
import { AppModule } from './src/app.module';
import { setupApp } from './src/setup';
import { createUser, CreateUserDto } from './test/utils/user';
import NodeEnvironment from 'jest-environment-node';
import supertest from 'supertest';

export interface Login {
  username: string;
  password: string;
}

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
      const request = supertest(app.getHttpServer());
      const login = async (payload: Login): Promise<Response> =>
        request.post('/api/auth/login').send(payload);
      const getToken = (payload: Promise<Response>): Promise<string> =>
        payload.then(res => res.body.data.token);

      const createAndLogin = async (
        adminToken: string,
        dto?: Partial<CreateUserDto>
      ): Promise<Response> => {
        const user = createUser(dto);
        await request
          .post(`/api/user`)
          .set('Authorization', `bearer ${adminToken}`)
          .send(user);
        return login(user);
      };

      this.global.app = app;
      this.global.request = request;
      this.global.login = login;
      this.global.loginAsDefaultAdmin = () =>
        login({
          username: configService.get('DEFAULT_USERNAME'),
          password: configService.get('DEFAULT_PASSWORD')
        });
      this.global.createAndLogin = createAndLogin;
      this.global.getToken = getToken;
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
