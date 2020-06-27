import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { createUser, rid } from './utils/user';

const mockUser = createUser({ role: UserRole.CLIENT });

const changeNickname: Partial<UpdateUserDto> = {
  nickname: `e2e-${rid()}`
};

const omit = <T>(payload: T, ...keys: (keyof T)[]) => {
  const clone = { ...payload };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
};

describe('UserController (e2e)', () => {
  let user: User;
  let users: User[];
  let adminToken: string;
  let clientToken: string;
  // let clientToken2: string;

  beforeAll(async () => {
    adminToken = await getToken(loginAsDefaultAdmin());
    clientToken = await getToken(createAndLogin(adminToken));
    expect(mockUser.role).toBe(UserRole.CLIENT);
  });

  describe('(POST) Create User', () => {
    const create = (
      params: Partial<CreateUserDto> = mockUser,
      token = adminToken
    ) =>
      request
        .post(`/api/user`)
        .set('Authorization', `bearer ${token}`)
        .send(params);

    it('success', async done => {
      const { password, ...match } = mockUser;
      const response = await create();
      user = response.body.data;

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(user).toMatchObject(match);
      expect(user.password).toBeUndefined();

      done();
    });

    it('unique property', async done => {
      const response = await Promise.all([
        create(),
        create(omit(mockUser, 'username')),
        create(omit(mockUser, 'email'))
      ]);

      response.map(res => expect(res.status).toBe(HttpStatus.BAD_REQUEST));

      done();
    });

    it('forbidden', async done => {
      const response = await create(undefined, clientToken);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      done();
    });
  });

  describe('(GET)  Get Users', () => {
    const getUsers = (token = adminToken) =>
      request.get(`/api/user`).set('Authorization', `bearer ${token}`);

    it('success', async done => {
      // TODO: expect.not.arrayContaining ?
      const response = await getUsers();
      expect(response.status).toBe(HttpStatus.OK);
      expect(Array.isArray(response.body.data.data)).toBeTruthy();

      users = response.body.data.data;

      for (const user of users) {
        expect(user.password).toBeUndefined();
      }

      done();
    });

    it('forbidden', async done => {
      const response = await getUsers(clientToken);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      done();
    });

    it('query - size', async done => {
      const query = { size: 20 };
      const response = await getUsers().query(query);
      const {
        data: newUsers,
        limit
      }: PaginateResult<User> = response.body.data;

      expect(newUsers.length).toBeLessThanOrEqual(query.size);
      expect(limit).toBeLessThanOrEqual(query.size);

      done();
    });

    it('query - empty', async done => {
      const query = { username: uuidv4() };
      const response = await getUsers().query(query);
      const { data: newUsers }: PaginateResult<User> = response.body.data;
      expect(newUsers.length).toBe(0);
      done();
    });

    it('query - unique property', async done => {
      [{ username: mockUser.username }, { email: mockUser.email }].map(
        async query => {
          const response = await getUsers().query(query);
          expect(response.body.data.data.length).toBe(1);
        }
      );
      done();
    });
  });

  describe('(GET)  Get User', () => {
    const getUser = (id: string, token = adminToken) =>
      request.get(`/api/user/${id}`).set('Authorization', `bearer ${token}`);

    it('success', async done => {
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
      done();
    });

    it('forbidden', async done => {
      if (user) {
        const response = await getUser(user.id, clientToken);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        done();
      }
      done();
    });
  });

  describe('(PTCH)  Update User', () => {
    const updateUser = (id: string, token = adminToken) =>
      request
        .patch(`/api/user/${id}`)
        .set('Authorization', `bearer ${token}`)
        .send(changeNickname);

    it('suceess', async done => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          updateUser(user.id),
          updateUser(user.id, mockUserToken)
        ]);
        response.forEach(res => {
          expect(res.status).toBe(HttpStatus.OK);
          expect(res.body.data).toMatchObject(changeNickname);
          expect(res.body.data.password).toBeUndefined();
        });
      }

      done();
    });

    it('forbidden', async done => {
      if (user) {
        const response = await updateUser(user.id, clientToken);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        done();
      }
      done();
    });
  });

  describe('(DEL)  Delete User', () => {
    const deleteUser = (id: string, token = adminToken) =>
      request.delete(`/api/user/${id}`).set('Authorization', `bearer ${token}`);
    it('success', async done => {
      if (user) {
        const mockUserToken = await getToken(login(mockUser));
        const response = await Promise.all([
          deleteUser(user.id, mockUserToken),
          deleteUser(user.id)
        ]);
        response.forEach(res => {
          expect(res.status).toBe(HttpStatus.OK);
        });
      }

      done();
    });

    it('forbidden', async done => {
      if (user) {
        const response = await deleteUser(user.id, clientToken);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        done();
      }
      done();
    });
  });
});
