import React, { useCallback } from 'react';
import { useForm } from 'rc-field-form';
import { Intent, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { UserRole, Param$CreateUser } from '../../typings';
import { createForm, validators, FormItemProps } from '../../utils/form';

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

const { Form, FormItem: DefaultFormItem } = createForm<Fields>();

interface Props extends Omit<AsyncFnDialogProps, 'onConfirm'> {
  id?: string;
  initialValues?: Partial<Fields>;
  onSubmit: (values: Fields) => void;
  exclude?: Exclude;
}

export const UserDialog = React.memo(
  ({ id, initialValues, onSubmit, exclude = [], ...props }: Props) => {
    const [form] = useForm();

    const FormItem = useCallback(
      ({ name, ...props }: FormItemProps<Fields>) => {
        if (typeof name === 'string' && exclude.includes(name)) {
          return null;
        }
        return <DefaultFormItem name={name} {...props} />;
      },
      [exclude]
    );

    return (
      <AsyncFnDialog
        {...props}
        intent={Intent.PRIMARY}
        onConfirm={form.submit}
        onClosed={() => form.resetFields()}
      >
        <Form
          form={form}
          onFinish={onSubmit}
          initialValues={{ ...defaultValue, ...initialValues }}
        >
          <FormItem name="nickname" label="Nickname">
            <InputGroup />
          </FormItem>

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

          <FormItem name="role" label="User Role">
            <HTMLSelect>
              <option value="">Select user role</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.MANAGER}>Manager</option>
              <option value={UserRole.CLIENT}>Client</option>
            </HTMLSelect>
          </FormItem>

          <button type="submit" hidden />
        </Form>
      </AsyncFnDialog>
    );
  }
);
