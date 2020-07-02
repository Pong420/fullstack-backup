import { Response } from 'supertest';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { Param$ModifyPassword, Param$DeleteAccount } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { REFRESH_TOKEN_COOKIES } from '../src/auth/auth.controller';
import { mockAdmin } from './utils/constants';
import { extractCookies } from './utils/extractCookies';
import { CreateUserDto, createUser } from './utils/user';

describe('AuthController (e2e)', () => {
  const configService = app.get<ConfigService>(ConfigService);
  const jwtExpires =
    configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') * 60 * 1000;
  const refreshTokenExpires =
    configService.get<number>('REFRESH_TOKEN_EXPIRES_IN_MINUTES') * 60 * 1000;
  let admin: User;
  let adminToken: string;
  let refreshToken: string;

  jest.setTimeout(refreshTokenExpires * 4);

  const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

  function validateCookies(response: Response) {
    const cookies = extractCookies(response.header);
    const cookie = cookies[REFRESH_TOKEN_COOKIES];
    expect(cookie).toBeDefined();
    expect(cookie.flag['Max-Age']).toBe(String(refreshTokenExpires));
    expect(cookie.flag['HttpOnly']).toBeTruthy();

    refreshToken = `${REFRESH_TOKEN_COOKIES}=${cookie.value}`;

    return cookie;
  }

  function registerAdmin(token: string, dto: CreateUserDto) {
    return request
      .post('/api/auth/register/admin')
      .set('Authorization', `bearer ${token}`)
      .send(dto);
  }

  describe('Login', () => {
    it('Login with default admin', async done => {
      // Check auth guard for registerAdmin
      let response = await registerAdmin(undefined, mockAdmin);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

      // Check login with default admin
      response = await loginAsDefaultAdmin();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject({ isDefaultAc: true });

      // Register an admin
      response = await registerAdmin(response.body.data.token, mockAdmin);
      expect(response.status).toBe(HttpStatus.CREATED);
      admin = response.body.data;

      // Default account will be disabled
      response = await loginAsDefaultAdmin();
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      done();
    });

    it('Login with registered account', async done => {
      if (admin) {
        const response = await login(mockAdmin);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.data).toMatchObject({ isDefaultAc: false });
        expect(response.body.data.password).toBeUndefined();

        adminToken = response.body.data.token;

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
    const cookie = cookies[REFRESH_TOKEN_COOKIES];
    expect(cookie.value).toBe('');
  });

  it.skip('JWT expires', async () => {
    const token = await getToken(
      admin ? login(mockAdmin) : loginAsDefaultAdmin()
    );
    let response = await registerAdmin(token, createUser());
    expect(response.status).toBe(HttpStatus.CREATED);
    await delay(jwtExpires * 2);
    response = await registerAdmin(token, createUser());
    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
  });

  describe('Modify password', () => {
    const newPassword = 'new-password-123';
    const modify = (token: string, params: Param$ModifyPassword) =>
      request
        .patch('/api/auth/modify-password')
        .set('Authorization', `bearer ${token}`)
        .send(params);
    const mockUser = createUser();
    let mockUserToken: string;

    beforeAll(async () => {
      mockUserToken = await getToken(createAndLogin(adminToken, mockUser));
    });

    it('bad request', async () => {
      if (mockUserToken) {
        const response = await Promise.all([
          modify(mockUserToken, {
            password: '',
            newPassword: '',
            confirmNewPassword: ''
          }),
          modify(mockUserToken, {
            password: mockUser.password,
            newPassword: '',
            confirmNewPassword: ''
          }),
          // Incorrect password format
          modify(mockUserToken, {
            password: mockUser.password,
            newPassword: 'q123-rewr',
            confirmNewPassword: ''
          }),
          // Not equal
          modify(mockUserToken, {
            password: mockUser.password,
            newPassword,
            confirmNewPassword: 'q12345678'
          })
        ]);
        for (const res of response) {
          expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        }
      }
    });

    it('success', async () => {
      if (mockUserToken) {
        const response = await modify(mockUserToken, {
          password: mockUser.password,
          newPassword,
          confirmNewPassword: newPassword
        });
        expect(response.status).toBe(HttpStatus.OK);
      }
    });
  });

  describe('Delete account', () => {
    const deleteAccount = (token: string, params: Param$DeleteAccount) =>
      request
        .delete('/api/auth/delete')
        .set('Authorization', `bearer ${token}`)
        .send(params);
    const mockUser = createUser();
    let mockUserToken: string;
    beforeAll(async () => {
      mockUserToken = await getToken(createAndLogin(adminToken, mockUser));
    });

    it('bad request', async () => {
      const response = await Promise.all([
        deleteAccount(mockUserToken, { password: '' })
      ]);
      for (const res of response) {
        expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('success', async () => {
      let response = await deleteAccount(mockUserToken, {
        password: mockUser.password
      });
      expect(response.status).toBe(HttpStatus.OK);

      response = await login(mockUser);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
