import { SuperAgentRequest } from 'superagent';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../../src/user/dto/update-user.dto';
import { rid } from '../utils/rid';
import qs from 'qs';

const prefix = '/api/user';

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
    .post(`${prefix}`)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .field(createUserDto(dto) as any);
}

export function getUsers(
  token: string,
  query: Record<string, any> = {}
): SuperAgentRequest {
  return request
    .get(`${prefix}`)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function getUser(token: string, id: string): SuperAgentRequest {
  return request.get(`${prefix}/${id}`).set('Authorization', `bearer ${token}`);
}

export function updateUser(
  token: string,
  { id, ...changes }: UpdateUserDto
): SuperAgentRequest {
  return request
    .patch(`${prefix}/${id}`)
    .set('Authorization', `bearer ${token}`)
    .set('Content-Type', 'multipart/form-data')
    .field((changes || {}) as any);
}

export function deleteUser(token: string, id: string): SuperAgentRequest {
  return request
    .delete(`${prefix}/${id}`)
    .set('Authorization', `bearer ${token}`);
}
