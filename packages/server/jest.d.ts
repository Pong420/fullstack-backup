import { INestApplication } from '@nestjs/common';

declare global {
  let app: INestApplication;

  namespace NodeJS {
    interface Global {
      app: INestApplication;
    }
  }
}
