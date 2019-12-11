import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useRxAsync from 'use-rx-async';
import { Password } from './Password';
import { AsyncFnDialog, AsyncFnDialogProps } from './Dialog';
import { Param$ModifyPassword } from '../typings';
import { authUserSelector, useAuthActions } from '../store';
import { modifyPassword } from '../services';
import { createForm, validators } from '../utils/form';
import { Toaster } from '../utils/toaster';

type Field = Pick<Param$ModifyPassword, 'password' | 'newPassword'> & {
  confirmNewPassword: string;
};

const { Form, FormItem, useForm } = createForm<Field>();

export function ModifyPasswordDialog({
  onClose,
  ...props
}: AsyncFnDialogProps) {
  const [form] = useForm();

  const { id } = useSelector(authUserSelector)!;
  const { logout } = useAuthActions();

  const onSuccess = useCallback(() => {
    logout();
    Toaster.success({
      message: 'Password modified success, plase login again'
    });
  }, [logout]);

  const { run, loading } = useRxAsync(modifyPassword, {
    defer: true,
    onSuccess
  });

  return (
    <div className="modify-password">
      <AsyncFnDialog
        icon="lock"
        intent="danger"
        title="Modify Password"
        onClose={onClose}
        loading={loading}
        onConfirm={form.submit}
        onClosed={() => form.resetFields()}
        {...props}
      >
        <Form
          form={form}
          initialValues={{
            password: '',
            newPassword: '',
            confirmNewPassword: ''
          }}
          onFinish={({ password, newPassword }) => {
            run({ id, password, newPassword });
          }}
        >
          <FormItem
            label="Old Password"
            name="password"
            validators={[validators.required('Please input your old password')]}
          >
            <Password />
          </FormItem>

          <FormItem
            label="New Password"
            name="newPassword"
            deps={['password']}
            validators={({ password }) => {
              return [
                validators.password({ msg: 'Please input new password' }),
                validators.shouldNotBeEqual(
                  password,
                  'The new password should not be equal to the old password'
                )
              ];
            }}
          >
            <Password />
          </FormItem>

          <FormItem
            label="Confirm New Password"
            name="confirmNewPassword"
            deps={['newPassword']}
            validators={({ newPassword }) => [
              validators.required('Please input the new password again'),
              validators.shouldBeEqual(
                newPassword,
                'Not the same as above new password'
              )
            ]}
          >
            <Password />
          </FormItem>

          <button hidden type="submit" />
        </Form>
      </AsyncFnDialog>
    </div>
  );
}
