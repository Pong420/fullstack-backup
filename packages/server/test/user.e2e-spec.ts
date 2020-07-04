import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { createUserDto, setupUsers, rid } from './utils/setupUsers';
import { login, getToken } from './utils/auth';
import superagent from 'superagent';
import path from 'path';

const mockUser = createUserDto({ role: UserRole.CLIENT });

const omit = <T>(payload: T, ...keys: (keyof T)[]) => {
  const clone = { ...payload };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
};

describe('UserController (e2e)', () => {
  let user: User;

  beforeAll(async () => {
    await setupUsers();
  });

  const createUser = (token: string, params: Partial<CreateUserDto> = {}) => {
    return request
      .post(`/api/user`)
      .set('Authorization', `bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field({ ...mockUser, ...params } as any);
  };

  const getUsers = (token: string) =>
    request.get(`/api/user`).set('Authorization', `bearer ${token}`);

  const getUser = (id: string, token = adminToken) =>
    request.get(`/api/user/${id}`).set('Authorization', `bearer ${token}`);

  const updateUser = (token: string, { id, ...changes }: UpdateUserDto) => {
    return request
      .patch(`/api/user/${id}`)
      .set('Authorization', `bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field((changes || {}) as any);
  };

  const deleteUser = (token: string, id: string) =>
    request.delete(`/api/user/${id}`).set('Authorization', `bearer ${token}`);

  describe('(POST) Create User', () => {
    it('success', async () => {
      const { password, ...match } = mockUser;
      const response = await createUser(adminToken, mockUser);
      user = response.body.data;

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(user).toMatchObject(match);
      expect(user.password).toBeUndefined();
    });

    it('unique property', async () => {
      const response = await Promise.all([
        createUser(adminToken, mockUser),
        createUser(adminToken, omit(mockUser, 'username')),
        createUser(adminToken, omit(mockUser, 'email'))
      ]);
      expect(response).toSatisfyAll(
        res => res.status === HttpStatus.BAD_REQUEST
      );
    });

    it('forbidden', async () => {
      const response = await createUser(clientToken, mockUser);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('(GET)  Get Users', () => {
    it('success ', async () => {
      const response = await Promise.all(
        [adminToken, managerToken].map(getUsers)
      );

      expect(response).toSatisfyAll(res => res.status === HttpStatus.OK);
      expect(response).toSatisfyAll(res => Array.isArray(res.body.data.data));
      expect(response).toSatisfyAll(res =>
        res.body.data.data.every(
          (user: User) => typeof user.password === 'undefined'
        )
      );
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
    it('success', async () => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          getUser(user.id),
          getUser(user.id, mockUserToken)
        ]);
        for (const res of response) {
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body.data).toEqual(user);
        }
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
          updateUser(clientToken, { id: user.id, ...changes }),
          updateUser(clientToken, { id: user.id, role: UserRole.MANAGER }),
          updateUser(managerToken, { id: user.id, role: UserRole.MANAGER }),
          updateUser(managerToken, { id: user.id, role: UserRole.ADMIN })
        ]);
        expect(response).toSatisfyAll(
          res => res.status === HttpStatus.FORBIDDEN
        );
      }
    });
  });

  describe('(DEL)  Delete User', () => {
    it('success', async () => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          deleteUser(mockUserToken, user.id),
          deleteUser(adminToken, user.id)
        ]);
        response.forEach(res => {
          expect(res.status).toBe(HttpStatus.OK);
        });
      }
    });

    it('forbidden', async () => {
      if (user) {
        const response = await deleteUser(clientToken, user.id);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  test.skip('cloudinary image should be removed', async () => {
    jest.setTimeout(60 * 1000);

    let response = await createUser(adminToken, createUserDto());
    let user: User = response.body.data;
    const attach = () =>
      updateUser(adminToken, { id: user.id }).attach(
        'avatar',
        path.resolve(__dirname, './utils/1x1.png')
      );

    // test case
    const actions = [
      () => attach(),
      () => updateUser(adminToken, { id: user.id, avatar: 'null' }),
      () => deleteUser(adminToken, user.id)
    ];

    for (const action of actions) {
      response = await attach();
      user = response.body.data;

      expect(user.avatar).toContain('cloudinary');

      response = await action();
      response = await superagent.get(user.avatar).catch(response => response);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
});
