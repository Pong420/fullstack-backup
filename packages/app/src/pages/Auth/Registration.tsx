import React from 'react';
import { TextInput, useFocusNextHandler } from '@/components/TextInput';
import { Password } from '@/components/Password';
import { createForm, validators } from '@/utils/form';
import { createAuthPage, Param$Registration } from './AuthPage';

const { FormItem } = createForm<Param$Registration>();

export function RegistrationForm({ onSubmit }: { onSubmit: () => void }) {
  const { refProps, focusNextProps } = useFocusNextHandler<
    Param$Registration
  >();

  return (
    <>
      <FormItem
        name="email"
        label="Email"
        validators={[
          validators.required('Please input an email')
          // TODO: validation
        ]}
      >
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          ref={refProps('email')}
          {...focusNextProps('username')}
        />
      </FormItem>

      <FormItem
        name="username"
        label="Username"
        validators={[validators.username.required, validators.username.format]}
      >
        <TextInput
          textContentType="username"
          autoCompleteType="username"
          ref={refProps('username')}
          {...focusNextProps('password')}
        />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        deps={['username']}
        validators={({ username }) => [
          validators.password.required,
          validators.password.format,
          validators.password.equalToUsername(username)
        ]}
      >
        <Password
          textContentType="newPassword"
          ref={refProps('password')}
          {...focusNextProps('confirmPassword')}
        />
      </FormItem>

      <FormItem
        name="confirmPassword"
        label="Confirm Password"
        deps={['password']}
        validators={({ password }) => [
          validators.required('Plase input confirm password'),
          validators.shouldBeEqual(
            password,
            'Confirm password is not equal to the above password'
          )
        ]}
      >
        <Password
          textContentType="newPassword"
          ref={refProps('confirmPassword')}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />
      </FormItem>
    </>
  );
}

export const Registration = createAuthPage({
  title: 'Register',
  content: RegistrationForm
});
