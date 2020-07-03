import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { rid } from './rid';

export { rid, CreateUserDto };

export const createUser = (payload?: Partial<CreateUserDto>): CreateUserDto => {
  const name = rid(8);
  return {
    username: `e2e${name}`,
    password: `e2e-${rid()}`,
    email: `e2e-${rid()}@gmail.com`,
    ...payload
  };
};
