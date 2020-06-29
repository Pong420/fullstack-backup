import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { Param$CreateUser } from '@fullstack/typings';
import { createUserForm, userValidaors } from '../../../components/UserForm';
import { registerAdmin } from '../../../service';
import { history } from '../../../store';
import { PATHS } from '../../../constants';
import { Toaster } from '../../../utils/toaster';

interface Store extends Omit<Param$CreateUser, 'avatar'> {
  confirmPassword: string;
}

const {
  Form,
  Username,
  Password,
  ConfirmPassword,
  Email,
  useForm
} = createUserForm();

const initialValues: Store = {
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: ''
};

const backToLogin = () => history.replace(PATHS.LOGIN);

const onFailure = Toaster.apiError.bind(Toaster, 'Register admin failure');

export function AdminRegisterForm() {
  const [form] = useForm();
  const { run, loading } = useRxAsync(registerAdmin, {
    defer: true,
    onSuccess: backToLogin,
    onFailure
  });

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={({ confirmPassword, ...params }) => run(params)}
    >
      <Username
        validators={[
          userValidaors.username.required,
          userValidaors.username.format
        ]}
      />

      <Password
        validators={[
          userValidaors.password.required,
          userValidaors.password.format
        ]}
      />

      <ConfirmPassword />

      <Email />

      <Button fill type="submit" intent="primary" loading={loading}>
        Register
      </Button>

      <Button
        fill
        minimal
        disabled={loading}
        onClick={() => form.resetFields()}
      >
        Reset Form
      </Button>
    </Form>
  );
}
