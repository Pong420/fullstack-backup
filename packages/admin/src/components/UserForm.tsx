import React from 'react';
import { Schema$User } from '@fullstack/typings';
import { RxFileToImageState } from 'use-rx-hooks';
import {
  createForm,
  validators,
  FormProps,
  FormItemProps
} from '../utils/form';
import { Input, Password as PasswordInput } from './Input';
import { UserRoleSelect } from './UserRoleSelect';

interface Schema extends Required<Omit<Schema$User, 'id' | 'avatar'>> {
  confirmPassword: string;
  avatar: RxFileToImageState | string | null;
}

interface AutoFocus {
  autoFocus?: boolean;
}

export type UserFormProps = FormProps<Schema>;
export type UserFormInstance = NonNullable<FormProps<Schema>['form']>;

export const userValidators = {
  username: validators.username,
  password: validators.password
};

export function createUserForm(itemProps?: FormItemProps<Schema>) {
  const components = createForm<Schema>(itemProps);
  const { Form, FormItem } = components;

  type FND = FormItemProps<Schema> & AutoFocus;

  function UserForm(props?: UserFormProps) {
    return <Form {...props} />;
  }

  const Username = ({ autoFocus, ...props }: FND = {}) => (
    <FormItem {...(props as unknown)} name="username" label="Username">
      <Input autoFocus={autoFocus} />
    </FormItem>
  );

  const Password = ({ autoFocus, ...props }: FND = {}) => (
    <FormItem {...(props as unknown)} name="password" label="Password">
      <PasswordInput autoFocus={autoFocus} />
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

  const Nickname = ({ autoFocus }: AutoFocus = {}) => (
    <FormItem name="nickname" label="Nickname">
      <Input autoFocus={autoFocus} />
    </FormItem>
  );

  const UserRole = () => (
    <FormItem name="role" label="User role" normalize={Number}>
      <UserRoleSelect />
    </FormItem>
  );

  return {
    ...components,
    UserForm,
    Username,
    Password,
    ConfirmPassword,
    Email,
    Nickname,
    UserRole
  };
}
