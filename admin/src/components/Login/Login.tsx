import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { RegisterForm } from './RegisterForm';
import { Param$Login } from '../../typings';
import { loginStatusSelector, useAuthActions } from '../../store';
import { createForm, validators } from '../../utils/form';
import { ReactComponent as Logo } from '../../assets/logo.svg';

const { Form, FormItem } = createForm<Param$Login>();

export const Login = ({ location }: RouteComponentProps) => {
  const { login } = useAuthActions();
  const loginsStatus = useSelector(loginStatusSelector);
  const register =
    !!(location.state && location.state.register) &&
    loginsStatus === 'loggedIn';

  return (
    <div className="login">
      <Card className="login-card" elevation={3}>
        <div className="login-card-header">
          <Logo />
        </div>
        <div className="login-card-body">
          {register ? (
            <RegisterForm />
          ) : (
            <Form
              initialValues={{ username: '', password: '' }}
              onFinish={login}
            >
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
          )}
        </div>
      </Card>
    </div>
  );
};
