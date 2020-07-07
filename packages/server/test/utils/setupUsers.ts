import { UserRole } from '@fullstack/typings';
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
}

export const mockAdmin = createUserDto({ role: UserRole.ADMIN });
export const mockManager = createUserDto({ role: UserRole.MANAGER });
export const mockClient = createUserDto({ role: UserRole.CLIENT });

export async function setupUsers(): Promise<void> {
  const defaultAdminToken = await getToken(loginAsDefaultAdmin());
  await registerAdmin(defaultAdminToken, mockAdmin);
  adminToken = await getToken(login(mockAdmin));
  managerToken = await getToken(createAndLogin(adminToken, mockManager));
  clientToken = await getToken(createAndLogin(adminToken, mockClient));
}
