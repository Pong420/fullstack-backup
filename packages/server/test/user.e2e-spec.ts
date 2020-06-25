import { v4 as uuidv4 } from 'uuid';
import { PaginateResult } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { createUser, rid } from './utils/user';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';

const mockUser = createUser();

const updateUser: Partial<UpdateUserDto> = {
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

  beforeAll(async () => {
    const respose = await loginAsDefaultAdmin();
    adminToken = respose.body.data.token;
  });

  it('(POST) Create User', async done => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...match } = mockUser;
    const create = (params: Partial<CreateUserDto> = mockUser) =>
      request
        .post(`/api/user`)
        .set('Authorization', `bearer ${adminToken}`)
        .send(params);
    const response = await create();

    user = response.body.data;

    expect(response.status).toBe(201);
    expect(user).toMatchObject(match);
    expect(user.password).toBeUndefined();

    [
      create(),
      create(omit(mockUser, 'username')),
      create(omit(mockUser, 'password')),
      create(omit(mockUser, 'email'))
    ].map(async request => {
      const response = await request;
      expect(response.status).toBe(400);
    });

    done();
  });

  describe('(GET)  Get Users', () => {
    const getUsers = () =>
      request.get(`/api/user`).set('Authorization', `bearer ${adminToken}`);

    it('Normal', async done => {
      // TODO: expect.not.arrayContaining ?
      const response = await getUsers();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.data)).toBeTruthy();

      users = response.body.data.data;

      for (const user of users) {
        expect(user.password).toBeUndefined();
      }

      done();
    });

    describe('Query', () => {
      it('size', async done => {
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

      it('empty', async done => {
        const query = { username: uuidv4() };
        const response = await getUsers().query(query);
        const { data: newUsers }: PaginateResult<User> = response.body.data;
        expect(newUsers.length).toBe(0);
        done();
      });

      it('unique property', async done => {
        [{ username: mockUser.username }, { email: mockUser.email }].map(
          async query => {
            const response = await getUsers().query(query);
            expect(response.body.data.data.length).toBe(1);
          }
        );
        done();
      });
    });
  });

  it('(GET)  Get User', async done => {
    if (user) {
      const response = await request
        .get(`/api/user/${user.id}`)
        .set('Authorization', `bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(user);
    }

    done();
  });

  it('(PTCH)  Update User', async done => {
    if (user) {
      const response = await request
        .patch(`/api/user/${user.id}`)
        .set('Authorization', `bearer ${adminToken}`)
        .send(updateUser);

      user = response.body.data;

      expect(response.status).toBe(200);
      expect(user).toMatchObject(updateUser);
      expect(user.password).toBeUndefined();
    }

    done();
  });

  it('(DEL)  Delete User', async done => {
    if (user) {
      const response = await request
        .delete(`/api/user/${user.id}`)
        .set('Authorization', `bearer ${adminToken}`);
      expect(response.status).toBe(200);
    }

    done();
  });
});
