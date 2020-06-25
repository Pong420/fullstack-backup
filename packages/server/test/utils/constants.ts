import { createUser } from './user';
import { UserRole } from '@fullstack/typings';

export const mockAdmin = createUser({ role: UserRole.ADMIN });
export const mockManager = createUser({ role: UserRole.MANAGER });
export const mockClient = createUser({ role: UserRole.CLIENT });
