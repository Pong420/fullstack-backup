export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
  GUEST = 'guest'
}

export interface Schema$User {
  id: string;

  email: string;

  username: string;

  password: string;

  role: UserRole;

  nickname: string;

  avatar: string | null;

  createdAt: string;

  updatedAt: string;
}
