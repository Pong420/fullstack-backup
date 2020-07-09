import React from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { createUserForm, userValidaors } from '../../../components/UserForm';
import { registerGuest } from '../../../service';
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

export function GuestRegistrationForm({ history }: RouteComponentProps) {
  const [form] = useForm();
  const { run, loading } = useRxAsync(registerGuest, {
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
        onClick={() => history.push(PATHS.LOGIN)}
      >
        Already have account
      </Button>
    </Form>
  );
}
