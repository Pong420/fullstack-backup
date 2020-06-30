import React from 'react';
import { Schema$User } from '@fullstack/typings';
import {
  createForm,
  validators,
  FormProps,
  FormItemProps
} from '../utils/form';
import { Input, Password as PasswordInput } from './Input';
import { UserRoleSelect } from './UserRoleSelect';

interface Schema extends Schema$User {
  confirmPassword: string;
}

export type UserFormProps = FormProps<Schema>;
export type UserFormInstance = NonNullable<FormProps<Schema>['form']>;

export const userValidaors = {
  username: {
    required: validators.required('Please input username'),
    format: validators.compose([
      validators.minLength(6, 'Username cannot less then 6'),
      validators.maxLength(20, 'Username cannot more then 20'),
      validators.regex(
        /^[a-z][a-z0-9]*$/i,
        'Username can only contain alphanumeric characters (letters A-Z, numbers 0-9)'
      )
    ])
  },
  password: {
    required: validators.required('Please input password'),
    format: validators.compose([
      validators.minLength(8, 'Password cannot less then 8'),
      validators.maxLength(20, 'Password cannot more then 20'),
      validators.regex(
        /(?=.*?[a-z,A-Z])(?=.*?[0-9])/,
        'Password must contain at least one  letter and one number'
      )
    ])
  }
};

export function createUserForm(itemProps?: FormItemProps<Schema>) {
  const components = createForm<Schema>(itemProps);
  const { FormItem } = components;

  type FND = FormItemProps<Schema> & { deps?: undefined };

  const Username = (props?: FND) => (
    <FormItem {...props} name="username" label="Username">
      <Input />
    </FormItem>
  );

  const Password = (props?: FND) => (
    <FormItem {...props} name="password" label="Password">
      <PasswordInput />
    </FormItem>
  );

  const ConfirmPassword = () => (
    <FormItem
      name="confirmPassword"
      label="Confirm Password"
      deps={['password']}
      validators={({ password }) => [
        validators.required('Please input the  password again'),
        validators.shouldBeEqual(
          password,
          'Confirm password is not equal to the above password'
        )
      ]}
    >
      <PasswordInput />
    </FormItem>
  );

  const Email = () => (
    <FormItem
      name="email"
      label="Email"
      validators={[
        validators.required('Please input an email')
        // TODO:
      ]}
    >
      <Input />
    </FormItem>
  );

  const Nickname = () => (
    <FormItem name="nickname" label="Nickname">
      <Input />
    </FormItem>
  );

  const UserRole = () => (
    <FormItem name="role" label="User role" normalize={Number}>
      <UserRoleSelect />
    </FormItem>
  );

  return {
    ...components,
    Username,
    Password,
    ConfirmPassword,
    Email,
    Nickname,
    UserRole
  };
}
