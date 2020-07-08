import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { PaginateResult, UserRole } from '@fullstack/typings';
import { User } from '../src/user/schemas/user.schema';
import { setupUsers } from './utils/setupUsers';
import { login, getToken } from './service/auth';
import { cloudinarySign, cloudinaryUpload } from './service/cloudinary';
import {
  CreateUserDto,
  UpdateUserDto,
  createUserDto,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser
} from './service/users';
import { rid } from './utils/rid';
import superagent from 'superagent';
import path from 'path';

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

  describe('(GET)  Get Users', () => {
    let users: User[] = [];
    beforeAll(async () => {
      const options: Partial<CreateUserDto>[] = [
        { role: UserRole.MANAGER },
        { role: UserRole.CLIENT }
      ];
      users = await Promise.all(
        options.map(dto =>
          createUser(adminToken, dto).then(res => res.body.data)
        )
      );
    });

    it('success ', async () => {
      const response = await Promise.all(
        [adminToken, managerToken].map(token => getUsers(token))
      );

      expect(response[0].body.data.data).toSatisfyAll(
        (user: User) => user.role !== UserRole.ADMIN
      );
      expect(response[1].body.data.data).toSatisfyAll(
        (user: User) => user.role === UserRole.CLIENT
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
      [{ username: users[0].username }, { email: users[0].email }].map(
        async query => {
          const response = await getUsers(adminToken).query(query);
          expect(response.body.data.data.length).toBe(1);
        }
      );
    });
  });

  describe('(GET)  Get User', () => {
    let user: User;
    const mockUser = createUserDto({ role: UserRole.CLIENT });
    beforeAll(async () => {
      const response = await createUser(adminToken, mockUser);
      user = response.body.data;
    });

    it('success', async () => {
      const mockUserToken = await getToken(login(mockUser));
      const response = await Promise.all([
        getUser(adminToken, user.id),
        getUser(managerToken, user.id),
        getUser(mockUserToken, user.id)
      ]);
      for (const res of response) {
        expect(res.status).toBe(HttpStatus.OK);
        expect(res.body.data).toEqual(user);
      }
    });

    it('forbidden', async () => {
      const response = await getUser(clientToken, user.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('(POST) Create User', () => {
    const mockUser = createUserDto();

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

  describe('(PTCH)  Update User', () => {
    const changes: Partial<UpdateUserDto> = {
      nickname: `e2e-${rid()}`
    };
    let user: User;
    const mockUser = createUserDto({ role: UserRole.CLIENT });
    beforeAll(async () => {
      const response = await createUser(adminToken, mockUser);
      user = response.body.data;
    });

    it('suceess', async () => {
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
    });

    it('forbidden', async () => {
      const response = await Promise.all([
        updateUser(clientToken, { id: user.id, ...changes }),
        updateUser(clientToken, { id: user.id, role: UserRole.MANAGER }),
        updateUser(managerToken, { id: user.id, role: UserRole.MANAGER }),
        updateUser(managerToken, { id: user.id, role: UserRole.ADMIN })
      ]);
      expect(response).toSatisfyAll(res => res.status === HttpStatus.FORBIDDEN);
    });
  });

  describe('(DEL)  Delete User', () => {
    let user: User;
    const mockUser = createUserDto({ role: UserRole.CLIENT });
    beforeAll(async () => {
      const response = await createUser(adminToken, mockUser);
      user = response.body.data;
    });

    it('forbidden', async () => {
      const response = await deleteUser(clientToken, user.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('success', async () => {
      const mockUserToken = await getToken(login(mockUser));
      const response = await Promise.all([
        deleteUser(mockUserToken, user.id),
        deleteUser(adminToken, user.id)
      ]);
      response.forEach(res => {
        expect(res.status).toBe(HttpStatus.OK);
      });
    });
  });

  test.skip('cloudinary image should be removed', async () => {
    jest.setTimeout(60 * 1000);

    let response = await createUser(adminToken, createUserDto());
    let user: User = response.body.data;
    const signPayload = await cloudinarySign(adminToken);

    const attach = async () => {
      const uploaded = await cloudinaryUpload({
        ...signPayload,
        file: path.resolve(__dirname, './utils/1x1.png')
      });
      return updateUser(adminToken, {
        id: user.id,
        avatar: uploaded.secure_url
      });
    };

    // test case
    const actions = [
      // replace
      () => attach(),
      // remove
      () => updateUser(adminToken, { id: user.id, avatar: null }),
      // delete
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
