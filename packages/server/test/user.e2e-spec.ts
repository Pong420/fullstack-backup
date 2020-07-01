import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { createUser, rid } from './utils/user';

const mockUser = createUser({ role: UserRole.CLIENT });

const omit = <T>(payload: T, ...keys: (keyof T)[]) => {
  const clone = { ...payload };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
};

describe('UserController (e2e)', () => {
  let user: User;
  let adminToken: string;
  let managerToken: string;
  let clientToken: string;

  beforeAll(async () => {
    adminToken = await getToken(loginAsDefaultAdmin());
    clientToken = await getToken(createAndLogin(adminToken));
    managerToken = await getToken(
      createAndLogin(adminToken, { role: UserRole.MANAGER })
    );
    expect(mockUser.role).toBe(UserRole.CLIENT);
  });

  describe('(POST) Create User', () => {
    const create = (token: string, params?: Partial<CreateUserDto>) => {
      const req = request
        .post(`/api/user`)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type', 'multipart/form-data');
      params = { ...mockUser, ...params };
      for (const key in params) {
        req.field(key, params[key]);
      }
      return req;
    };

    it('success', async () => {
      const { password, ...match } = mockUser;
      const response = await create(adminToken, mockUser);
      user = response.body.data;

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(user).toMatchObject(match);
      expect(user.password).toBeUndefined();
    });

    it('unique property', async () => {
      const response = await Promise.all([
        create(adminToken, mockUser),
        create(adminToken, omit(mockUser, 'username')),
        create(adminToken, omit(mockUser, 'email'))
      ]);

      response.map(res => expect(res.status).toBe(HttpStatus.BAD_REQUEST));
    });

    it('forbidden', async () => {
      const response = await create(clientToken, mockUser);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('(GET)  Get Users', () => {
    const getUsers = (token: string) =>
      request.get(`/api/user`).set('Authorization', `bearer ${token}`);

    it('success ', async () => {
      const response = await Promise.all(
        [adminToken, managerToken].map(getUsers)
      );

      for (const res of response) {
        expect(res.status).toBe(HttpStatus.OK);
        expect(Array.isArray(res.body.data.data)).toBeTruthy();
        for (const user of res.body.data.data) {
          expect(user.password).toBeUndefined();
        }
      }
    });

    it('forbidden', async () => {
      const response = await getUsers(clientToken);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('query - size', async () => {
      const query = { size: 20 };
      const response = await getUsers(adminToken).query(query);
      const {
        data: newUsers,
        limit
      }: PaginateResult<User> = response.body.data;

      expect(newUsers.length).toBeLessThanOrEqual(query.size);
      expect(limit).toBeLessThanOrEqual(query.size);
    });

    it('query - empty', async () => {
      const query = { username: uuidv4() };
      const response = await getUsers(adminToken).query(query);
      const { data: newUsers }: PaginateResult<User> = response.body.data;
      expect(newUsers.length).toBe(0);
    });

    it('query - unique property', async () => {
      [{ username: mockUser.username }, { email: mockUser.email }].map(
        async query => {
          const response = await getUsers(adminToken).query(query);
          expect(response.body.data.data.length).toBe(1);
        }
      );
    });
  });

  describe('(GET)  Get User', () => {
    const getUser = (id: string, token = adminToken) =>
      request.get(`/api/user/${id}`).set('Authorization', `bearer ${token}`);

    it('success', async () => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          getUser(user.id),
          getUser(user.id, mockUserToken)
        ]);
        response.forEach(res => {
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body.data).toEqual(user);
        });
      }
    });

    it('forbidden', async () => {
      if (user) {
        const response = await getUser(user.id, clientToken);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('(PTCH)  Update User', () => {
    const updateUser = (token: string, { id, ...changes }: UpdateUserDto) => {
      const req = request
        .patch(`/api/user/${id}`)
        .set('Authorization', `bearer ${token}`)
        .set('Content-Type', 'multipart/form-data');

      for (const key in changes) {
        req.field(key, changes[key]);
      }
      return req;
    };

    const changes: Partial<UpdateUserDto> = {
      nickname: `e2e-${rid()}`
    };

    it('suceess', async () => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          updateUser(adminToken, { id: user.id, ...changes }),
          updateUser(managerToken, { id: user.id, ...changes }),
          updateUser(mockUserToken, { id: user.id, ...changes })
        ]);

        for (const res of response) {
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body.data).toMatchObject(changes);
          expect(res.body.data.password).toBeUndefined();
        }
      }
    });

    it('forbidden', async () => {
      if (user) {
        const response = await Promise.all([
          // updateUser(clientToken, { id: user.id, ...changes }),
          // updateUser(clientToken, { id: user.id, role: UserRole.MANAGER }),
          // updateUser(managerToken, { id: user.id, role: UserRole.MANAGER }),
          updateUser(managerToken, { id: user.id, role: UserRole.ADMIN })
        ]);

        for (const res of response) {
          expect(res.status).toBe(HttpStatus.FORBIDDEN);
        }
      }
    });
  });

  describe('(DEL)  Delete User', () => {
    const deleteUser = (id: string, token: string) =>
      request.delete(`/api/user/${id}`).set('Authorization', `bearer ${token}`);
    it('success', async () => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          deleteUser(user.id, mockUserToken),
          deleteUser(user.id, adminToken)
        ]);
        response.forEach(res => {
          expect(res.status).toBe(HttpStatus.OK);
        });
      }
    });

    it('forbidden', async () => {
      if (user) {
        const response = await deleteUser(user.id, clientToken);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });
});
