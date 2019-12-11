import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserRole } from './model/user.model';
import { mongoConnection } from '../database';
import { UploadModule } from '../upload';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockReq = (data: Partial<Pick<User, 'username' | 'role'>> = {}): any => ({
  user: {
    username: 'string',
    role: UserRole.ADMIN,
    ...data
  }
});

const rid = (N = 5) => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // eslint-disable-next-line
  return Array.apply(null, Array(N))
    .map(() => s.charAt(Math.floor(Math.random() * s.length)))
    .join('');
};

function createMockUser(role: UserRole, name = rid()) {
  return {
    role,
    nickname: name,
    username: name,
    email: `${name}@gmail.com`
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mock = {
  user: {
    [UserRole.ADMIN]: createMockUser(UserRole.ADMIN, UserRole.ADMIN),
    [UserRole.MANAGER]: createMockUser(UserRole.MANAGER, UserRole.MANAGER),
    [UserRole.CLIENT]: createMockUser(UserRole.CLIENT, UserRole.CLIENT)
  }
};

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;
  let mongoServer: MongoMemoryServer;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mongoose: any;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    mongoose = await mongoConnection(mongoUri);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UploadModule],
      controllers: [UserController],
      providers: [UserService]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create user', () => {
    it(`${UserRole.ADMIN} role could create all users`, async () => {
      expect(
        await controller.createUser(
          { password: UserRole.ADMIN, ...mock.user[UserRole.ADMIN] },
          mockReq({ role: UserRole.ADMIN })
        )
      ).toMatchObject(mock.user[UserRole.ADMIN]);

      expect(
        await controller.createUser(
          { password: UserRole.MANAGER, ...mock.user[UserRole.MANAGER] },
          mockReq({ role: UserRole.ADMIN })
        )
      ).toMatchObject(mock.user[UserRole.MANAGER]);

      expect(
        await controller.createUser(
          { password: UserRole.CLIENT, ...mock.user[UserRole.CLIENT] },
          mockReq({ role: UserRole.ADMIN })
        )
      ).toMatchObject(mock.user[UserRole.CLIENT]);
    });

    it(`${UserRole.MANAGER} role could not create ${UserRole.ADMIN} user`, async () => {
      try {
        controller.createUser(
          { password: rid(), ...createMockUser(UserRole.ADMIN) },
          mockReq({ role: UserRole.MANAGER })
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('get users', () => {
    it(`${UserRole.ADMIN} role should get all users`, async () => {
      expect(
        (await controller.getUsers(mockReq(), { pageNo: 1, pageSize: 100 }))
          .docs.length
      ).toBe(3);
    });

    it(`${UserRole.MANAGER} role should not get ${UserRole.ADMIN} users`, async () => {
      expect(
        (await controller.getUsers(
          mockReq({ role: UserRole.MANAGER })
        )).docs.every(user => user.role !== UserRole.ADMIN)
      ).toBe(true);
    });
  });

  describe('update user', () => {
    it('user nickname will be changed', async () => {
      const mockUser = createMockUser(UserRole.ADMIN);
      const newUser = await controller.createUser(
        { password: '', ...mockUser },
        mockReq()
      );
      const changes = createMockUser(UserRole.ADMIN);

      expect(
        await controller.updateUser(
          newUser.id,
          { id: newUser.id, ...changes },
          mockReq({ ...mockUser })
        )
      ).toMatchObject(changes);
    });

    it('users who have the same role cannot be changed by each other', async () => {
      const role = UserRole.ADMIN;
      const mockUser = createMockUser(role);
      const newAdmin = await controller.createUser(
        { password: '', ...mockUser },
        mockReq()
      );

      try {
        await controller.updateUser(
          newAdmin.id,
          { id: newAdmin.id, nickname: 'change' },
          mockReq({ ...mock.user[role] })
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('delete user', () => {
    it('user could not delete itself', async () => {
      const mockUser = createMockUser(UserRole.ADMIN);
      const newUser = await controller.createUser(
        { password: '', ...mockUser },
        mockReq()
      );

      try {
        expect(
          await controller.deleteUser(newUser.id, mockReq({ ...mockUser }))
        ).toMatchObject({});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('users who have the same role cannot be deleted by each other', async () => {
      const role = UserRole.ADMIN;
      const mockUser = createMockUser(role);
      const newAdmin = await controller.createUser(
        { password: '', ...mockUser },
        mockReq()
      );

      try {
        await controller.deleteUser(
          newAdmin.id,
          mockReq({ ...mock.user[role] })
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe(`${UserRole.CLIENT} permission`, () => {
    it(`${UserRole.CLIENT} could access his data`, async () => {
      const client = (await controller.getUsers(mockReq(), {
        pageNo: 1,
        pageSize: 1000
      })).docs.find(({ role }) => role === UserRole.CLIENT);

      if (client) {
        expect(
          await controller.getUser(
            mockReq({ ...mock.user[UserRole.CLIENT] }),
            client.id
          )
        ).toMatchObject(mock.user[UserRole.CLIENT]);
      }
    });

    it(`${UserRole.CLIENT} could not others user data`, async () => {
      try {
        expect(
          await controller.getUsers(mockReq({ ...mock.user[UserRole.CLIENT] }))
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe(`password`, () => {
    it(`Password should not be return`, async () => {
      const mockUser = createMockUser(UserRole.ADMIN);
      const newAdmin = await controller.createUser(
        { password: '12345678', ...mockUser },
        mockReq()
      );

      const req = mockReq({ ...mockUser });

      const result = [
        newAdmin,
        ...(await controller.getUsers(req)).docs,
        await controller.getUser(req, newAdmin.id),
        await controller.updateUser(
          newAdmin.id,
          { id: newAdmin.id, ...createMockUser(UserRole.ADMIN) },
          req
        )
      ];

      expect(
        result.every(obj => !obj || typeof obj.password === 'undefined')
      ).toBe(true);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
});
