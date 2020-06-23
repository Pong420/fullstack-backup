import { User } from 'src/user/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { PaginateResult } from '@fullstack/typings';
import request from 'supertest';

const createUser: CreateUserDto = {
  username: 'e2e-user',
  password: 'e2e12345',
  email: 'e2e-user-email@gmail.com'
};

const updateUser: Partial<UpdateUserDto> = {
  nickname: 'e2e-nickname'
};

describe('UserController (e2e)', () => {
  let user: User;
  let users: User[];

  it('(POST) Create User', async done => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...match } = createUser;
    const create = () =>
      request(app.getHttpServer()).post('/user').send(createUser);
    let response = await create();

    user = response.body.data;

    expect(response.status).toBe(201);
    expect(user).toMatchObject(match);
    expect(user.password).toBeUndefined();

    response = await create();
    expect(response.status).toBe(400);

    done();
  });

  describe('(GET)  Get Users', () => {
    const getUsers = () => request(app.getHttpServer()).get(`/user`);

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

      it('unique property', async done => {
        if (users.length > 1) {
          [{ username: createUser.username }, { email: createUser.email }].map(
            async query =>
              expect(
                getUsers()
                  .query(query)
                  .then(
                    res => (res.body.data as PaginateResult<User>).data.length
                  )
              ).resolves.toBe(1)
          );
        }

        done();
      });
    });
  });

  it('(GET)  Get User', async done => {
    if (user) {
      const response = await request(app.getHttpServer()).get(
        `/user/${user.id}`
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(user);
    }

    done();
  });

  it('(PUT)  Update User', async done => {
    if (user) {
      const response = await request(app.getHttpServer())
        .put(`/user/${user.id}`)
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
      const response = await request(app.getHttpServer()).delete(
        `/user/${user.id}`
      );
      expect(response.status).toBe(200);
    }

    done();
  });
});
