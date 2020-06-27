import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { Param$CreateUser } from '@fullstack/typings';
import { createUserForm, userValidaors } from '../../../components/UserForm';
import { registerAdmin } from '../../../service';
import { history } from '../../../store';
import { PATHS } from '../../../constants';

const {
  Form,
  Username,
  Password,
  ConfirmPassword,
  Email,
  useForm
} = createUserForm();

const initialValues: Omit<Param$CreateUser, 'avatar'> = {
  username: '',
  password: '',
  email: '',
  nickname: ''
};

const backToLogin = () => history.replace(PATHS.LOGIN);

export function AdminRegisterForm() {
  const [form] = useForm();
  const { run, loading } = useRxAsync(registerAdmin, {
    defer: true,
    onSuccess: backToLogin
  });

  return (
    <Form form={form} initialValues={initialValues} onFinish={run}>
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
