import { APIError, ValidationError } from '../typings';

const getMsgFromValidationError = (message: ValidationError[]): string[] =>
  message.map(({ constraints, children }) => {
    return constraints
      ? Object.values<string>(constraints)
      : getMsgFromValidationError(children);
  })[0];

export function getErrorMessage(error: APIError): string {
  if (error.response) {
    const { message } = error.response.data;
    return Array.isArray(message)
      ? getMsgFromValidationError(message)[0]
      : message;
  }

  return error.message;
}
