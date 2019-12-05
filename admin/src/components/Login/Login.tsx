import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Param$Login } from '../../typings';
import { loginStatusSelector, useAuthActions } from '../../store';
import { createForm, validators } from '../../utils/form';

const { Form, FormItem } = createForm<Param$Login>();

export const Login = () => {
  const loginsStatus = useSelector(loginStatusSelector);
  const { login } = useAuthActions();

  return (
    <div className="login">
      <Card className="login-card" elevation={3}>
        <div className="login-card-header">
          <Logo />
        </div>
        <div className="login-card-body">
          <Form initialValues={{ username: '', password: '' }} onFinish={login}>
            <FormItem
              name="username"
              label="Username"
              validators={[validators.required('Please input username')]}
            >
              <InputGroup />
            </FormItem>

            <FormItem
              name="password"
              label="Password"
              validators={[validators.required('Please input password')]}
            >
              <InputGroup type="password" />
            </FormItem>

            <Button
              fill
              type="submit"
              intent="primary"
              loading={loginsStatus === 'loading'}
            >
              Login
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
};
