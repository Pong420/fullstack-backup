import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { Param$Login } from '@fullstack/typings';
import { createUserForm, userValidaors } from '../../../components/UserForm';
import { useAuthActions, loginStatusSelector } from '../../../store';

const initialValues: Param$Login = { username: '', password: '' };

const { Form, Username, Password } = createUserForm();

export function LoginForm() {
  const { authorize } = useAuthActions();
  const loading = useSelector(loginStatusSelector) === 'loading';

  return (
    <Form initialValues={initialValues} onFinish={authorize}>
      <Username validators={[userValidaors.username.required]} />

      <Password validators={[userValidaors.password.required]} />

      <Button fill type="submit" intent="primary" loading={loading}>
        Login
      </Button>
    </Form>
  );
}
