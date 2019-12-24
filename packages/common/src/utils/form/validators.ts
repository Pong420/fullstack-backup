/* eslint-disable @typescript-eslint/no-explicit-any */

import isEmailVaidator from 'validator/es/lib/isEmail';
import { validationConfig } from '../validationConfig';

export type Validator = (rule: any, value: any) => Promise<void>;
export type HigherOrderValidator = (...args: any[]) => Validator;

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

export const required: HigherOrderValidator = (msg: string) => (_, value) => {
  const val = typeof value === 'string' ? value.trim() : value;
  const valid = !!(Array.isArray(val)
    ? val.length
    : !(typeof val === 'undefined' || val === null || val === ''));
  return valid ? Promise.resolve() : Promise.reject(msg);
};

export const number: Validator = (_, value) =>
  /^[0-9]/.test(value)
    ? Promise.resolve()
    : Promise.reject('Plase input number only');

export const integer: HigherOrderValidator = (msg: string) => (_, value) =>
  /^[0-9]+\d*$/.test(value) ? Promise.resolve() : Promise.reject(msg);

const numberComparation = (
  callback: (value: number, flag: number) => boolean
) => (flag: number, msg: string, inclusive = false) => {
  const validator: Validator = (_, value) => {
    const num = parseFloat(value);
    return !isNaN(num) && (callback(num, flag) || (inclusive && num === flag))
      ? Promise.resolve()
      : Promise.reject(msg);
  };
  return validator;
};

export const min = numberComparation((value, flag) => value > flag);
export const max = numberComparation((value, flag) => value < flag);

const lengthComparation = (
  type: string,
  callback: (length: number, flag: number) => boolean
) => (flag: number, prefix: string) => {
  const validator: Validator = (_, value) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return callback(value.length, flag)
        ? Promise.resolve()
        : Promise.reject(
            `${prefix} must be ${type} than or equal to ${flag} characters`
          );
    }
    return Promise.resolve();
  };
  return validator;
};

export const minLength = lengthComparation(
  'longer',
  (length, minLength) => length >= minLength
);

export const maxLength = lengthComparation(
  'shorter',
  (length, maxLength) => length <= maxLength
);

export const shouldBeEqual: HigherOrderValidator = (val: any, msg: string) => (
  _,
  value
) => (value === val ? Promise.resolve() : Promise.reject(msg));

export const shouldNotBeEqual: HigherOrderValidator = (
  val: any,
  msg: string
) => (_, value) => (value !== val ? Promise.resolve() : Promise.reject(msg));

export const username = compose([
  minLength(validationConfig.username.minLength, `Username `),
  maxLength(validationConfig.username.maxLength, `Username`)
]);

export const passwordFormat: Validator = (_, value) =>
  validationConfig.password.regex.test(value)
    ? Promise.resolve()
    : Promise.reject('Password must include english and number');

export const password = ({
  required: _required = true,
  msg = 'Plase input password'
}: {
  required?: boolean;
  msg?: string;
} = {}) => {
  const { password } = validationConfig;
  return compose([
    _required ? required(msg) : null,
    minLength(password.minLength, `Password `),
    maxLength(password.maxLength, `Password `),
    passwordFormat
  ]);
};

export const isEmail: Validator = (_, value) =>
  isEmailVaidator(value)
    ? Promise.resolve()
    : Promise.reject('Plase input a correct email');

export const isEmpty: Validator = (_, value) =>
  value == null || !(Object.keys(value) || value).length
    ? Promise.resolve()
    : Promise.reject('');
