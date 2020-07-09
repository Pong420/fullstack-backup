export const USERNAME_MIN_LENGTH = 6;
export const USERNAME_MIN_LENGTH_MESSAGE = `Username cannot less then ${USERNAME_MIN_LENGTH}`;

export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_MAX_LENGTH_MESSAGE = `Username cannot more then ${USERNAME_MAX_LENGTH}`;

export const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
export const USERNAME_REGEX_MESSAGE =
  'Username can only contain alphanumeric characters (letters A-Z, numbers 0-9)';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_MESSAGE = `Password cannot less then ${PASSWORD_MIN_LENGTH}`;

export const PASSWORD_MAX_LENGTH = 32;
export const PASSWORD_MAX_LENGTH_MESSAGE = `Password cannot more then ${PASSWORD_MAX_LENGTH}`;

export const PASSWORD_REGEX = /(?=.*?[a-z,A-Z])(?=.*?[0-9])/;
export const PASSWORD_REGEX_MESSAGE =
  'Password must contain at least one letter and one number';

export const PASSWORD_EUQAL_TO_USERNAME =
  'Password should not same as username';
