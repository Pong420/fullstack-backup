import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mock = {
  users: [
    {
      role: 'admin',
      avatar: null,
      nickname: 'Pong420',
      username: 'samfung',
      email: 'samfunghp@gmail.com',
      createdAt: '2019-12-06T02:13:53.954Z',
      updatedAt: '2019-12-06T03:38:28.533Z',
      id: '5de9b9613fa00d10568c4afe'
    },
    {
      role: 'client',
      avatar: null,
      nickname: 'Client',
      username: 'client',
      email: 'client@gmail.com',
      createdAt: '2019-12-06T02:54:23.922Z',
      updatedAt: '2019-12-06T03:25:39.667Z',
      id: '5de9c2dff176ed156f2aaeed'
    },
    {
      role: 'manager',
      avatar: null,
      nickname: 'Manager',
      username: 'manager',
      email: 'manager@gmail.com',
      createdAt: '2019-12-06T02:58:03.720Z',
      updatedAt: '2019-12-06T02:58:03.720Z',
      id: '5de9c3bb0fada615aca2d6ae'
    },
    {
      role: 'client',
      avatar: null,
      nickname: 'foo',
      email: 'youremail@gmail.com',
      username: 'foo',
      createdAt: '2019-12-06T03:56:59.203Z',
      updatedAt: '2019-12-06T03:56:59.203Z',
      id: '5de9d18b5cddc41b9f531d04'
    }
  ]
};

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});
