import { SuperAgentRequest } from 'superagent';

export interface Login {
  username: string;
  password: string;
}

export const login = (payload: Login): SuperAgentRequest =>
  request.post('/api/auth/login').send(payload);
