import { APIError } from '../typings';

export function getErrorMessage(error: APIError) {
  if (error.response) {
    const { message } = error.response.data;
    if (Array.isArray(message)) {
      return message.map(({ constraints }) => Object.values(constraints))[0][0];
    }

    return message;
  }

  return error.message;
}
