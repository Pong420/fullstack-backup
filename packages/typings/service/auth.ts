import { JWTSignResult, JWTSignPayload } from './jwt';
import { ApiResponse } from './index';

export interface Param$Login {
  username: string;
  password: string;
}

export interface Schema$Login extends JWTSignResult {
  user: JWTSignPayload;
  isDefaultAc: boolean;
}

export type Response$Login = ApiResponse<Schema$Login>;

export interface Param$ModifyPassword {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface Param$DeleteAccount {
  password: string;
}

export interface Schema$CloudinarySign {
  signature: string;
  timestamp: number; // unix time
}

export type Response$CloudinarySign = ApiResponse<Schema$CloudinarySign>;

export interface Param$CloudinaryUpload extends Schema$CloudinarySign {
  file: File | string;
  api_key?: string;
  eager?: string;
}

export interface Response$CloudinaryUpload {
  secure_url: string;
}
