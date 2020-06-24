import { v4 as uuidv4 } from 'uuid';
import { PaginateResult } from '@fullstack/typings';
import { User } from 'src/user/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

const createUser: CreateUserDto = {
  username: 'e2e-user',
  password: 'e2e12345',
  email: 'e2e-user-email@gmail.com'
};

const updateUser: Partial<UpdateUserDto> = {
  nickname: 'e2e-nickname'
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

  it('(POST) Create User', async done => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...match } = createUser;
    const create = (params: Partial<CreateUserDto> = createUser) =>
      request.post(`/api/user`).send(params);
    const response = await create();

    user = response.body.data;

    expect(response.status).toBe(201);
    expect(user).toMatchObject(match);
    expect(user.password).toBeUndefined();

    [
      create(),
      create(omit(createUser, 'username')),
      create(omit(createUser, 'password')),
      create(omit(createUser, 'email'))
    ].map(async request => {
      const response = await request;
      expect(response.status).toBe(400);
    });

    done();
  });

  describe('(GET)  Get Users', () => {
    const getUsers = () => request.get(`/api/user`);

    it('Normal', async done => {
      // TODO: expect.not.arrayContaining ?
      const response = await getUsers();
      users = response.body.data.data;

      expect(response.status).toBe(200);
      expect(Array.isArray(users)).toBeTruthy();

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

        expect(newUsers.length).toBe(query.size);
        expect(limit).toBe(query.size);

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
        [{ username: createUser.username }, { email: createUser.email }].map(
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
      const response = await request.get(`/api/user/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(user);
    }

    done();
  });

  it('(PUT)  Update User', async done => {
    if (user) {
      const response = await request
        .put(`/api/user/${user.id}`)
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
      const response = await request.delete(`/api/user/${user.id}`);
      expect(response.status).toBe(200);
    }

    done();
  });
});
