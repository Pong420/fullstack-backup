import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createForm } from '@fullstack/common/utils/form/form';
import * as validators from '@fullstack/common/utils/form/validators';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { Password } from '../../components/Password';
import { Param$Login } from '../../typings';
import { loginStatusSelector, useAuthActions } from '../../store';
import { PATHS } from '../../constants';
import { ReactComponent as Logo } from '../../assets/logo.svg';

const { Form, FormItem } = createForm<Param$Login>();

export const Login = ({ history }: RouteComponentProps) => {
  const { login } = useAuthActions();
  const loginsStatus = useSelector(loginStatusSelector);

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
              <Password />
            </FormItem>

            <Button
              fill
              type="submit"
              intent="primary"
              loading={loginsStatus === 'loading'}
            >
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
        </div>
      </Card>
    </div>
  );
};
