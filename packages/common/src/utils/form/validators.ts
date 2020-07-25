import {
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_MESSAGE,
  USERNAME_REGEX,
  USERNAME_REGEX_MESSAGE,
  PASSWORD_EUQAL_TO_USERNAME,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REGEX_MESSAGE
} from '../../constants';

export type Validator = (rule: any, value: any) => Promise<void>;

export const compose = (validators: Array<Validator | null>): Validator => {
  return async (rule, value) => {
    for (const validator of validators) {
      if (validator) {
        try {
          await validator(rule, value);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.resolve();
  };
};

export const required = (msg: string): Validator => (_, value) => {
  const val = typeof value === 'string' ? value.trim() : value;
  const valid = !!(Array.isArray(val)
    ? val.length
    : typeof value === 'boolean' // for checkbox
    ? value
    : !(typeof val === 'undefined' || val === null || val === ''));
  return valid ? Promise.resolve() : Promise.reject(msg);
};

export const number: Validator = (_, value) =>
  !value || value === '-' || /^-?\d*\.?\d*$/.test(value)
    ? Promise.resolve()
    : Promise.reject('Plase input number only');

export const integer = (msg = 'Plase input integer only'): Validator => (
  _,
  value
) =>
  value === '' || /^(-)?\d*$/.test(value)
    ? Promise.resolve()
    : Promise.reject(msg);

export const maxDecimal = (max: number): Validator => (_, value) =>
  value === '' || new RegExp(`^(\\d+|\\d\\.\\d{0,${max}})$`).test(value)
    ? Promise.resolve()
    : Promise.reject(`Should not more then ${max} decimal`);

const numberComparation = (
  callback: (value: number, flag: number) => boolean
) => (flag: number, msg: string, inclusive = false) => {
  const validator: Validator = (_, value) => {
    const num = Number(value);
    return value === '' ||
      isNaN(num) ||
      callback(num, flag) ||
      (inclusive && num === flag)
      ? Promise.resolve()
      : Promise.reject(msg);
  };
  return validator;
};

export const min = numberComparation((value, flag) => value > flag);
export const max = numberComparation((value, flag) => value < flag);

const lengthComparation = (
  callback: (length: number, flag: number) => boolean
) => (flag: number, msg: string) => {
  const validator: Validator = (_, value) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return callback(value.length, flag)
        ? Promise.resolve()
        : Promise.reject(msg);
    }
    return Promise.resolve();
  };
  return validator;
};

export const minLength = lengthComparation(
  (length, minLength) => length >= minLength
);

export const maxLength = lengthComparation(
  (length, maxLength) => length <= maxLength
);

export const shouldBeEqual = (val: any, msg: string): Validator => (_, value) =>
  value === val ? Promise.resolve() : Promise.reject(msg);

export const shouldNotBeEqual = (val: any, msg: string): Validator => (
  _,
  value
) => (value !== val ? Promise.resolve() : Promise.reject(msg));

export const regex = (regex: RegExp, msg: string): Validator => (_, value) => {
  const valid = typeof value === 'string' ? regex.test(value) : false;
  return valid ? Promise.resolve() : Promise.reject(msg);
};

export const username = {
  required: required('Please input username'),
  format: compose([
    minLength(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_MESSAGE),
    maxLength(USERNAME_MAX_LENGTH, USERNAME_MAX_LENGTH_MESSAGE),
    regex(USERNAME_REGEX, USERNAME_REGEX_MESSAGE)
  ])
};

export const password = {
  required: required('Please input password'),
  format: compose([
    minLength(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    maxLength(PASSWORD_MAX_LENGTH, PASSWORD_MAX_LENGTH_MESSAGE),
    regex(PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE)
  ]),
  equalToUsername: (username: string) =>
    shouldNotBeEqual(username, PASSWORD_EUQAL_TO_USERNAME)
};

export const oldPassword = [required('Please input your old password')];

export const newPassword = ({ password }: { password: string }) => [
  required('Please input new password'),
  shouldNotBeEqual(
    password,
    'The new password should not be equal to the old password'
  )
];

export const confirmNewPassword = ({
  newPassword
}: {
  newPassword: string;
}) => [
  required('Please input the new password again'),
  shouldBeEqual(
    newPassword,
    'Confirm new password is not equal to the above new password'
  )
];
