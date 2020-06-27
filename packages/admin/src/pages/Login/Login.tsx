import React from 'react';
import { Button } from '@blueprintjs/core';
import { Param$Login } from '@fullstack/typings';
import { CardWithLogo } from '../../components/CardWithLogo';
import { Input, Password } from '../../components/Input';
import { createForm, validators } from '../../utils/form';
import { useAuthActions, loginStatusSelector } from '../../store';
import { useSelector } from 'react-redux';

const { Form, FormItem } = createForm<Param$Login>();
const initialValues: Param$Login = { username: '', password: '' };

export function Login() {
  const { authorize } = useAuthActions();
  const loading = useSelector(loginStatusSelector) === 'loading';

  return (
    <div className="login">
      <CardWithLogo title="LOGIN">
        <Form initialValues={initialValues} onFinish={authorize}>
          <FormItem
            name="username"
            label="Username"
            validators={[
              validators.required('Please input username'),
              validators.regex(
                /^[a-z][a-z0-9]*$/i,
                'Username must be english character or alphanumeric'
              )
            ]}
          >
            <Input />
          </FormItem>

          <FormItem
            name="password"
            label="Password"
            validators={[
              validators.required('Please input password'),
              validators.regex(
                /(?=.*?[a-z,A-Z])(?=.*?[0-9])/,
                'Password must contain at least one  letter and one number'
              )
            ]}
          >
            <Password />
          </FormItem>

          <Button fill type="submit" intent="primary" loading={loading}>
            Login
          </Button>

          <Button
            fill
            minimal
            className="goto-guest-registration"
            disabled={loading}
          >
            Register as Guest
          </Button>
        </Form>
      </CardWithLogo>
    </div>
  );
}
