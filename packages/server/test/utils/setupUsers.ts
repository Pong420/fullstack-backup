import { UserRole, Schema$Authenticated } from '@fullstack/typings';
import {
  login,
  loginAsDefaultAdmin,
  getToken,
  registerAdmin,
  createAndLogin
} from '../service/auth';
import { createUserDto } from '../service/users';

declare global {
  let adminToken: string;
  let managerToken: string;
  let clientToken: string;
  let admin: Schema$Authenticated;
  let manager: Schema$Authenticated;
  let client: Schema$Authenticated;
}

export const mockAdmin = createUserDto({ role: UserRole.ADMIN });
export const mockManager = createUserDto({ role: UserRole.MANAGER });
export const mockClient = createUserDto({ role: UserRole.CLIENT });

// TODO: remove XXX token variable

export async function setupUsers(): Promise<void> {
  const defaultAdminToken = await getToken(loginAsDefaultAdmin());
  await registerAdmin(defaultAdminToken, mockAdmin);

  let response = await login(mockAdmin);
  admin = response.body.data;
  adminToken = admin.token;

  response = await createAndLogin(adminToken, mockManager);
  manager = response.body.data;
  managerToken = manager.token;

  response = await createAndLogin(adminToken, mockClient);
  client = response.body.data;
  clientToken = client.token;
}
