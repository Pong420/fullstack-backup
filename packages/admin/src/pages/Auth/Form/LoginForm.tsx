import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { createUserForm, userValidators } from '../../../components/UserForm';
import { useAuthActions, loginStatusSelector } from '../../../store';
import { PATHS } from '../../../constants';

const { Form, Username, Password } = createUserForm();

export function LoginForm({ history }: RouteComponentProps) {
  const { authenticate } = useAuthActions();
  const loading = useSelector(loginStatusSelector) === 'loading';

  return (
    <Form onFinish={authenticate}>
      <Username validators={[userValidators.username.required]} />

      <Password validators={[userValidators.password.required]} />

      <Button fill type="submit" intent="primary" loading={loading}>
        Login
      </Button>

      <Button
        fill
        minimal
        className="goto-guest-registration"
        onClick={() => history.push(PATHS.GUEST_REGISTRATION)}
      >
        Register as Guest
      </Button>
    </Form>
  );
}
