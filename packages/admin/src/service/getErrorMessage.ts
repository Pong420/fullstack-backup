import { ApiError } from '@fullstack/typings';

export function getErrorMessage(error: ApiError): string {
  if (error.response) {
    const { message } = error.response.data;
    return Array.isArray(message) ? message[0] : message;
  }
  return error.message;
}
