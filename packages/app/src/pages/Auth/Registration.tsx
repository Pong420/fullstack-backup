import React from 'react';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { createAuthPage, Param$Registration } from './AuthPage';

const { FormItem } = createForm<Param$Registration>();

export function RegistrationForm() {
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
        />
      </FormItem>

      <FormItem
        name="username"
        label="Username"
        validators={[validators.username.required, validators.username.format]}
      >
        <TextInput textContentType="username" autoCompleteType="username" />
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
        <Password textContentType="newPassword" />
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
        <Password textContentType="newPassword" />
      </FormItem>
    </>
  );
}

export const Registration = createAuthPage({
  title: 'Register',
  content: RegistrationForm
});
