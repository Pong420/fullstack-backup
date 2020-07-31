import React from 'react';
import { TextInput, useFocusNextHandler } from '@/components/TextInput';
import { Password } from '@/components/Password';
import { createForm, validators } from '@/utils/form';
import { createAuthPage, Param$Login } from './AuthPage';

const { FormItem } = createForm<Param$Login>();

export function LoginForm({ onSubmit }: { onSubmit: () => void }) {
  const { refProps, focusNextProps } = useFocusNextHandler<Param$Login>();

  return (
    <>
      <FormItem
        name="username"
        label="Username"
        validators={[validators.username.required]}
      >
        <TextInput
          textContentType="username"
          autoCompleteType="username"
          {...focusNextProps('password')}
        />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        validators={[validators.password.required]}
      >
        <Password
          ref={refProps('password')}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
      </FormItem>
    </>
  );
}

export const Login = createAuthPage<Param$Login>({
  title: 'Login',
  content: LoginForm
});
