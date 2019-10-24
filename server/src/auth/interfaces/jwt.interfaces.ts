export interface JWTSignPayload {
  username: string;
  role: string;
}

export interface ValidatePayload extends JWTSignPayload {
  exp: number;
}
