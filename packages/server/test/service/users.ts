import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../../src/user/dto/update-user.dto';
import { rid } from '../utils/rid';
import qs from 'qs';

export { CreateUserDto, UpdateUserDto };

export const createUserDto = (
  payload?: Partial<CreateUserDto>
): CreateUserDto => {
  const name = rid(8);
  return {
    username: `e2e${name}`,
    password: `e2e-${rid()}`,
    email: `e2e-${rid()}@gmail.com`,
    ...payload
  };
};

export function createUser(
  token: string,
  dto: Partial<CreateUserDto> = {}
): SuperAgentRequest {
  return request
    .post(paths.create_user)
    .set('Authorization', `bearer ${token}`)
    .send(createUserDto(dto) as any);
}

export function getUsers(
  token: string,
  query: Record<string, any> = {}
): SuperAgentRequest {
  return request
    .get(paths.get_users)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function getUser(token: string, id: string): SuperAgentRequest {
  return request
    .get(paths.get_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`);
}

export function updateUser(
  token: string,
  { id, ...changes }: UpdateUserDto
): SuperAgentRequest {
  return request
    .patch(paths.update_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send((changes || {}) as any);
}

export function deleteUser(token: string, id: string): SuperAgentRequest {
  return request
    .delete(paths.delete_user.generatePath({ id }))
    .set('Authorization', `bearer ${token}`);
}
