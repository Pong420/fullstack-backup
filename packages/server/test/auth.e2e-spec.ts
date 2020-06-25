import { UserRole } from '@fullstack/typings';
import { User } from 'src/user/schemas/user.schema';
import { createUser } from './utils/user';
import { ConfigService } from '@nestjs/config';

interface Login {
  username: string;
  password: string;
}

const login = (payload: Login) => request.post('/api/auth/login').send(payload);
const mockUser = createUser();

describe('AuthController (e2e)', () => {
  const configService = app.get<ConfigService>(ConfigService);
  let user: User;

  describe('Login', () => {
    it('Login with default admin', async done => {
      const loginAsDefault = () =>
        login({
          username: configService.get('DEFAULT_USERNAME'),
          password: configService.get('DEFAULT_PASSWORD')
        });

      let response = await loginAsDefault();
      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({ isDefaultAc: true });
      expect(response.body.data.password).toBeUndefined();

      // register admin
      // TODO: update api path
      response = await request
        .post('/api/user')
        .send({ ...mockUser, role: UserRole.ADMIN });

      expect(response.status).toBe(201);
      user = response.body.data;

      response = await loginAsDefault();
      expect(response.status).toBe(400);

      done();
    });

    it('Login with registered account', async done => {
      if (user) {
        const response = await login(mockUser);
        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({ isDefaultAc: false });
        expect(response.body.data.password).toBeUndefined();
      }
      done();
    });
  });

  // TODO: refresh-token, expires, logou
});
