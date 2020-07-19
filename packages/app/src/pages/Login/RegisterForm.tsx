import React from 'react';
import { View } from 'react-native';
import { Param$CreateUser } from '@fullstack/typings';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { Button } from '../../components/Button';

type Fields = Required<Param$CreateUser & { confirmPassword: string }>;

const { Form, FormItem, useForm } = createForm<Fields>();

interface Props {
  loading?: boolean;
  onSubmit?: (params: Param$CreateUser) => void;
}

export function RegisterForm({ loading, onSubmit }: Props) {
  const [form] = useForm();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Form form={form} onFinish={onSubmit}>
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
          <Password textContentType={undefined} />
        </FormItem>

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
