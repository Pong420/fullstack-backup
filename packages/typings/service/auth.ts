import { JWTSignResult, JWTSignPayload } from './jwt';
import { ApiResponse } from './index';

export interface Param$Authenticated {
  username: string;
  password: string;
}

export interface Schema$Authenticated extends JWTSignResult {
  user: JWTSignPayload;
  isDefaultAc: boolean;
}

export type Response$Authenticated = ApiResponse<Schema$Authenticated>;

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
  file: File | Buffer | string;
  api_key?: string;
  eager?: string;
}

export interface Response$CloudinaryUpload {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}
