export interface Cloudinary$Image {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUploadFile(obj: any): obj is UploadFile {
  return obj && typeof obj === 'object' && obj.hasOwnProperty('filename');
}
