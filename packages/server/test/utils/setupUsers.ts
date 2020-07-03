import { CreateUserDto } from './user';
import { mockAdmin, mockManager, mockClient } from './constants';

declare global {
  let adminToken: string;
  let managerToken: string;
  let clientToken: string;
}

function registerAdmin(token: string, dto: CreateUserDto) {
  return request
    .post('/api/auth/register/admin')
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export async function setupUsers(): Promise<void> {
  const defaultAdminToken = await getToken(loginAsDefaultAdmin());
  await registerAdmin(defaultAdminToken, mockAdmin);
  adminToken = await getToken(login(mockAdmin));
  managerToken = await getToken(createAndLogin(adminToken, mockManager));
  clientToken = await getToken(createAndLogin(adminToken, mockClient));
}
