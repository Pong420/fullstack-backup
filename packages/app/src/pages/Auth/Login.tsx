import React from 'react';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { createAuthPage, Param$Login } from './AuthPage';

const { FormItem } = createForm<Param$Login>();

export function LoginForm() {
  return (
    <>
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
    </>
  );
}

export const Login = createAuthPage<Param$Login>({
  title: 'Login',
  content: LoginForm
});
