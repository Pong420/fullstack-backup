import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import superagent from 'superagent';

declare global {
  let app: INestApplication;
  let request: supertest.SuperTest<superagent.SuperAgentRequest>;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
      request: supertest.SuperTest<superagent.SuperAgentRequest>;
    }
  }
}
