import React from 'react';
import { useForm } from 'rc-field-form';
import { Intent, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../Dialog';
import { UserRole, Param$CreateUser } from '../../typings';
import { createForm, validators } from '../../utils/form';

type Fields = Required<Param$CreateUser>;

const defaultValue: Fields = {
  email: '',
  username: '',
  password: '',
  role: UserRole.CLIENT
};

const { Form, FormItem } = createForm<Fields>();

interface Props extends Omit<AsyncFnDialogProps, 'onConfirm'> {
  id?: string;
  initialValues?: Partial<Fields>;
  onSubmit: (values: Fields) => void;
}

export const UserDialog = React.memo(
  ({ id, initialValues, onSubmit, ...props }: Props) => {
    const [form] = useForm();

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
          <FormItem
            name="email"
            label="Email"
            validators={[validators.required('Please input email')]}
          >
            <InputGroup />
          </FormItem>

          <FormItem name="username" label="Username">
            <InputGroup />
          </FormItem>

          <FormItem name="password" label="Password">
            <InputGroup />
          </FormItem>

          <FormItem name="role" label="User Role">
            <HTMLSelect>
              <option value="">Select user role &nbsp;</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.GENERAL}>General</option>
              <option value={UserRole.CLIENT}>Client</option>
            </HTMLSelect>
          </FormItem>

          <button type="submit" hidden />
        </Form>
      </AsyncFnDialog>
    );
  }
);
