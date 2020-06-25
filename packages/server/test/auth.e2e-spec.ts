import { Response } from 'supertest';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@fullstack/typings';
import { User } from 'src/user/schemas/user.schema';
import { createUser } from './utils/user';
import { extractCookies } from './utils/extractCookies';

interface Login {
  username: string;
  password: string;
}

const login = (payload: Login) => request.post('/api/auth/login').send(payload);
const mockAdmin = createUser({ role: UserRole.ADMIN });

describe('AuthController (e2e)', () => {
  const configService = app.get<ConfigService>(ConfigService);
  const refreshTokenExpires =
    configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES') * 60 * 1000;
  let admin: User;
  let refreshToken: string;

  jest.setTimeout(refreshTokenExpires * 4);

  const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

  function validateCookies(response: Response) {
    const cookies = extractCookies(response.header);
    const cookie = cookies['fullstack_refresh_token'];
    expect(cookie).toBeDefined();
    expect(cookie.flag['Max-Age']).toBe(String(refreshTokenExpires));
    expect(cookie.flag['HttpOnly']).toBeTruthy();

    refreshToken = `fullstack_refresh_token=${cookie.value}`;

    return cookie;
  }

  describe('Login', () => {
    it('Login with default admin', async done => {
      const loginAsDefault = () =>
        login({
          username: configService.get('DEFAULT_USERNAME'),
          password: configService.get('DEFAULT_PASSWORD')
        });

      let response = await loginAsDefault();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject({ isDefaultAc: true });
      expect(response.body.data.password).toBeUndefined();

      // Register an admin
      response = await request.post('/api/auth/register').send(mockAdmin);

      expect(response.status).toBe(HttpStatus.CREATED);
      admin = response.body.data;

      // Default account will be disabled
      response = await loginAsDefault();
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      done();
    });

    it('Login with registered account', async done => {
      if (admin) {
        const response = await login(mockAdmin);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.data).toMatchObject({ isDefaultAc: false });
        expect(response.body.data.password).toBeUndefined();

        validateCookies(response);
      }
      done();
    });
  });

  describe('Refresh Token', () => {
    const run = () =>
      request
        .post('/api/auth/refresh-token')
        .set('Cookie', [refreshToken])
        .send();

    it('Refresh', async () => {
      if (refreshToken) {
        const response = await run();
        expect(response.status).toBe(HttpStatus.OK);
        validateCookies(response);
      }
    });

    it.skip('Expires', async () => {
      if (refreshToken) {
        await delay(refreshTokenExpires * 2);
        const response = await run();
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  it('Logout', async () => {
    const response = await request.post('/api/auth/logout');
    expect(response.status).toBe(HttpStatus.OK);
    const cookies = extractCookies(response.header);
    const cookie = cookies['fullstack_refresh_token'];
    expect(cookie.value).toBe('');
  });
});