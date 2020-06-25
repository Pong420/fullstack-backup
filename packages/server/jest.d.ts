import { INestApplication } from '@nestjs/common';
import { SuperTest } from 'supertest';
import { SuperAgentRequest } from 'superagent';

declare global {
  let app: INestApplication;
  let request: SuperTest<SuperAgentRequest>;
  let loginAsDefaultAdmin: () => SuperAgentRequest;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
      request: SuperTest<SuperAgentRequest>;
      loginAsDefaultAdmin: () => SuperAgentRequest;
    }
  }
}
