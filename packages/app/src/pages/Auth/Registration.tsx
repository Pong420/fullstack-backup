import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Param$CreateUser } from '@fullstack/typings';
import { createForm, validators } from '../../utils/form';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { createAuthPage, AuthFormProps } from './AuthPage';

type Schema = Required<Param$CreateUser & { confirmPassword: string }>;

const { Form, FormItem, useForm } = createForm<Schema>();

export function RegistrationForm({ loading, onSubmit }: AuthFormProps) {
  const [form] = useForm();

  return (
    <View style={styles.container}>
      <Form form={form} onFinish={onSubmit}>
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
          validators={[
            validators.username.required,
            validators.username.format
          ]}
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
      </Form>
      <View>
        <Button
          title="Register"
          intent="DARK"
          loading={loading}
          onPress={form.submit}
        />
      </View>
    </View>
  );
}

export const Registration = createAuthPage({
  title: 'Register',
  form: RegistrationForm
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'space-between' }
});
