import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { Button } from '@blueprintjs/core';
import { registerAdmin } from '@fullstack/common/service';
import { createUserForm, userValidaors } from '../../../components/UserForm';
import { history } from '../../../store';
import { PATHS } from '../../../constants';
import { Toaster } from '../../../utils/toaster';

const {
  Form,
  Username,
  Password,
  ConfirmPassword,
  Email,
  useForm
} = createUserForm();

const backToLogin = () => history.replace(PATHS.LOGIN);

const onFailure = Toaster.apiError.bind(Toaster, 'Register admin failure');

export function AdminRegistrationForm() {
  const [form] = useForm();
  const { run, loading } = useRxAsync(registerAdmin, {
    defer: true,
    onSuccess: backToLogin,
    onFailure
  });

  return (
    <Form
      form={form}
      onFinish={({ confirmPassword, ...params }) => run(params)}
    >
      <Username
        validators={[
          userValidaors.username.required,
          userValidaors.username.format
        ]}
      />

      <Password
        deps={['username']}
        validators={({ username }) => [
          userValidaors.password.required,
          userValidaors.password.format,
          userValidaors.password.equalToUsername(username)
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
