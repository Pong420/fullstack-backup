import React, { useCallback, ReactNode } from 'react';
import { InputGroup, HTMLSelect } from '@blueprintjs/core';
import {
  createForm,
  validators,
  FormItemProps,
  FormInstance
} from '@fullstack/common/utils/form';
import { Validator } from '@fullstack/common/utils/form/validators';
import { Password } from './Password';
import { Param$CreateUser, UserRole } from '../typings';

type Fields = Required<Param$CreateUser & { confirmPassword: string }>;

export type Exclude = Array<keyof Fields>;

const defaultValue: Fields = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  avatar: null,
  role: UserRole.CLIENT
};

const { Form, FormItem: BaseFormItem, useForm } = createForm<Fields>();

export const useUserForm = useForm;

export interface UserFormProps {
  form?: FormInstance<Fields>;
  initialValues?: Partial<Fields>;
  onSubmit: (values: Fields) => void;
  exclude?: Exclude;
  children?: ReactNode;
  passwordValidators?: Validator[];
  autoComplete?: string;
}

const defaultPasswordValidation: UserFormProps['passwordValidators'] = [
  validators.password()
];

export const UserForm = React.memo<UserFormProps>(
  ({
    form: _form,
    exclude = ['confirmPassword'],
    onSubmit,
    initialValues,
    children,
    passwordValidators = defaultPasswordValidation,
    autoComplete = 'off'
  }) => {
    const [form] = useForm(_form);

    const FormItem = useCallback(
      ({ name, ...props }: FormItemProps<Fields>) => {
        if (typeof name === 'string' && exclude.includes(name)) {
          return null;
        }
        return <BaseFormItem name={name} {...props} />;
      },
      [exclude]
    );

    return (
      <Form
        form={form}
        onFinish={onSubmit}
        initialValues={{ ...defaultValue, ...initialValues }}
      >
        <FormItem
          name="username"
          label="Username"
          validators={[
            validators.required('Please input username'),
            validators.username
          ]}
        >
          <InputGroup />
        </FormItem>

        <FormItem
          name="password"
          label="Password"
          validators={passwordValidators}
        >
          <Password autoComplete={autoComplete} />
        </FormItem>

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
          <Password autoComplete={autoComplete} />
        </FormItem>

        <FormItem
          name="email"
          label="Email"
          validators={[
            validators.required('Please input an email'),
            validators.isEmail
          ]}
        >
          <InputGroup autoComplete={autoComplete} />
        </FormItem>

        <FormItem name="nickname" label="Nickname">
          <InputGroup />
        </FormItem>

        <FormItem name="role" label="User Role">
          <HTMLSelect>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.CLIENT}>Client</option>
          </HTMLSelect>
        </FormItem>

        <button type="submit" hidden />

        {children}
      </Form>
    );
  }
);
