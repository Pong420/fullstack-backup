import { SuperAgentRequest, Response } from 'superagent';
import { UserRole } from '@fullstack/typings';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { login, loginAsDefaultAdmin, getToken } from './auth';
import { rid } from './rid';

declare global {
  let adminToken: string;
  let managerToken: string;
  let clientToken: string;
}

export { CreateUserDto, rid };

export function registerAdmin(
  token: string,
  dto: CreateUserDto
): SuperAgentRequest {
  return request
    .post('/api/auth/register/admin')
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

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

export const mockAdmin = createUserDto({ role: UserRole.ADMIN });
export const mockManager = createUserDto({ role: UserRole.MANAGER });
export const mockClient = createUserDto({ role: UserRole.CLIENT });

export async function createAndLogin(
  adminToken: string,
  dto: Partial<CreateUserDto> = {}
): Promise<Response> {
  const user = createUserDto(dto);
  const userRes = await request
    .post(`/api/user`)
    .set('Authorization', `bearer ${adminToken}`)
    .set('Content-Type', 'multipart/form-data')
    .field(user as any);
  return userRes.error
    ? Promise.reject(userRes.error.text) //
    : login(user);
}

export async function setupUsers(): Promise<void> {
  const defaultAdminToken = await getToken(loginAsDefaultAdmin());
  await registerAdmin(defaultAdminToken, mockAdmin);
  adminToken = await getToken(login(mockAdmin));
  managerToken = await getToken(createAndLogin(adminToken, mockManager));
  clientToken = await getToken(createAndLogin(adminToken, mockClient));
}
