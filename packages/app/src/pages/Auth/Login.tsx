import React from 'react';
import { Param$Login } from '@fullstack/typings';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { createAuthPage, AuthFormProps } from './AuthPage';

const { Form, FormItem } = createForm<Param$Login>();

export function LoginForm(props: AuthFormProps<Param$Login>) {
  return (
    <Form {...props}>
      <FormItem
        name="username"
        label="Username"
        validators={[validators.username.required]}
      >
        <TextInput textContentType="username" autoCompleteType="username" />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        validators={[validators.password.required]}
      >
        <Password />
      </FormItem>
    </Form>
  );
}

export const Login = createAuthPage<Param$Login>({
  title: 'Login',
  form: LoginForm
});
