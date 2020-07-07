import { SuperAgentRequest, Response } from 'superagent';
import { ConfigService } from '@nestjs/config';
import { Param$ModifyPassword, Param$DeleteAccount } from '@fullstack/typings';
import { paths } from '@fullstack/common/constants';
import { createUserDto, CreateUserDto, createUser } from './users';

interface Login {
  username: string;
  password: string;
}

const prefix = '/api';

export async function login(payload: Login): Promise<Response> {
  return request.post(`${prefix}${paths.login}`).send(payload);
}

export async function getToken(
  payload: Response | Promise<Response>
): Promise<string> {
  return (payload instanceof Promise ? payload : Promise.resolve(payload)).then(
    res => {
      if (res.error) {
        return Promise.reject(res.error.text);
      }
      return res.body.data.token;
    }
  );
}

export function loginAsDefaultAdmin(): Promise<Response> {
  const configService = app.get<ConfigService>(ConfigService);
  return login({
    username: configService.get('DEFAULT_USERNAME'),
    password: configService.get('DEFAULT_PASSWORD')
  });
}

export function registerAdmin(
  token: string,
  dto: CreateUserDto
): SuperAgentRequest {
  return request
    .post(`${prefix}${paths.admin_registration}`)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export async function createAndLogin(
  token: string,
  dto: Partial<CreateUserDto> = {}
): Promise<Response> {
  const user = createUserDto(dto);
  const userRes = await createUser(token, user);
  return userRes.error
    ? Promise.reject(userRes.error.text) //
    : login(user);
}

export function refreshToken(token: string): SuperAgentRequest {
  return request
    .post(`${prefix}${paths.refresh_token}`)
    .set('Cookie', [token])
    .send();
}
export function logout(): SuperAgentRequest {
  return request.post(`${prefix}${paths.logout}`);
}

export function modifyPassword(
  token: string,
  params: Param$ModifyPassword
): SuperAgentRequest {
  return request
    .patch(`${prefix}${paths.modify_password}`)
    .set('Authorization', `bearer ${token}`)
    .send(params);
}

export function deleteAccount(
  token: string,
  params: Param$DeleteAccount
): SuperAgentRequest {
  return request
    .delete(`${prefix}${paths.delete_account}`)
    .set('Authorization', `bearer ${token}`)
    .send(params);
}
