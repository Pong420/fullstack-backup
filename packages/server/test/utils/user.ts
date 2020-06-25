import { CreateUserDto } from 'src/user/dto/create-user.dto';

export const rid = (N = 5): string => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: N }, () =>
    s.charAt(Math.floor(Math.random() * s.length))
  ).join('');
};

export const createUser = (payload?: Partial<CreateUserDto>): CreateUserDto => {
  const name = rid(8);
  return {
    username: `e2e-${name}`,
    password: `e2e-${rid()}`,
    email: `e2e-${rid()}@gmail.com`,
    ...payload
  };
};
