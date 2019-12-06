import React, { useCallback, ReactNode } from 'react';
import { useForm, FormInstance } from 'rc-field-form';
import { InputGroup, HTMLSelect } from '@blueprintjs/core';
import { Param$CreateUser, UserRole } from '../typings';
import { createForm, validators, FormItemProps } from '../utils/form';

type Fields = Required<Param$CreateUser>;

export type Exclude = Array<keyof Fields>;

const defaultValue: Fields = {
  email: '',
  username: '',
  password: '',
  nickname: '',
  avatar: null,
  role: UserRole.CLIENT
};

const { Form, FormItem: BaseFormItem } = createForm<Fields>();

export interface UserFormProps {
  form?: FormInstance;
  initialValues?: Partial<Fields>;
  onSubmit: (values: Fields) => void;
  exclude?: Exclude;
  children?: ReactNode;
}

export const UserForm = React.memo<UserFormProps>(
  ({ form: _form, exclude = [], onSubmit, initialValues, children }) => {
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
        <FormItem name="username" label="Username">
          <InputGroup />
        </FormItem>

        <FormItem name="password" label="Password">
          <InputGroup />
        </FormItem>

        <FormItem
          name="email"
          label="Email"
          validators={[
            validators.required('Please input email'),
            validators.isEmail
          ]}
        >
          <InputGroup />
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
