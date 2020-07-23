import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Param$Login } from '@fullstack/typings';
import { createForm, validators } from '../../utils/form';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { createAuthPage, AuthFormProps } from './AuthPage';

const { Form, FormItem, useForm } = createForm<Param$Login>();

export function LoginForm({ loading, onSubmit }: AuthFormProps) {
  const [form] = useForm();

  return (
    <View style={styles.container}>
      <Form form={form} onFinish={onSubmit}>
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
      <View>
        <Button
          title="Login"
          intent="DARK"
          onPress={form.submit}
          loading={loading}
        />
      </View>
    </View>
  );
}

export const Login = createAuthPage({
  title: 'Login',
  form: LoginForm
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'space-between' }
});
