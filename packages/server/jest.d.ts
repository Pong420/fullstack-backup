import { INestApplication } from '@nestjs/common';
import { SuperTest } from 'supertest';
import { SuperAgentRequest, Response } from 'superagent';
import { CreateUserDto } from './test/utils/user';

interface Login {
  username: string;
  password: string;
}

type CreateAndLogin = (
  adminToken: string,
  dto?: Partial<CreateUserDto>
) => Promise<Response>;

type CreateAndGetToken = (
  adminToken: string,
  dto?: Partial<CreateUserDto>
) => Promise<string>;

declare global {
  let app: INestApplication;
  let request: SuperTest<SuperAgentRequest>;
  let login: (payload: Login) => Promise<Response>;
  let loginAsDefaultAdmin: () => Promise<Response>;
  let createAndLogin: CreateAndLogin;
  let getToken: (payload: Response | Promise<Response>) => Promise<string>;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
      request: SuperTest<SuperAgentRequest>;
      login: (payload: Login) => Promise<Response>;
      loginAsDefaultAdmin: () => Promise<Response>;
      createAndLogin: CreateAndLogin;
      getToken: (payload: Response | Promise<Response>) => Promise<string>;
    }
  }
}
