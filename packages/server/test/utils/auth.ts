import { ConfigService } from '@nestjs/config';
import { Response } from 'supertest';

interface Login {
  username: string;
  password: string;
}

export async function login(payload: Login): Promise<Response> {
  return request.post('/api/auth/login').send(payload);
}

export async function getToken(
  payload: Response | Promise<Response>
): Promise<string> {
  return (payload instanceof Promise ? payload : Promise.resolve(payload)).then(
    res => {
      if (res.error) {
        return Promise.reject(res.error.text);
      }
      return res.body.data.token;
    }
  );
}

export function loginAsDefaultAdmin(): Promise<Response> {
  const configService = app.get<ConfigService>(ConfigService);
  return login({
    username: configService.get('DEFAULT_USERNAME'),
    password: configService.get('DEFAULT_PASSWORD')
  });
}
