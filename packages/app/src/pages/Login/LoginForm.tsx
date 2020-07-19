import React from 'react';
import { View } from 'react-native';
import { Param$Login } from '@fullstack/typings';
import { createForm, validators } from '../../utils/form';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';

const { Form, FormItem, useForm } = createForm<Param$Login>();

interface Props {
  loading?: boolean;
  onSubmit?: (payload: Param$Login) => void;
}

export function LoginForm({ loading, onSubmit }: Props) {
  const [form] = useForm();

  return (
    <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <Form form={form} onFinish={onSubmit}>
        <FormItem
          name="username"
          label="Username"
          validators={[validators.required('Please input username')]}
        >
          <TextInput textContentType="username" autoCompleteType="username" />
        </FormItem>

        <FormItem
          name="password"
          label="Password"
          validators={[validators.required('Please input password')]}
        >
          <Password />
        </FormItem>
      </Form>
      <View>
        <Button
          title="Login"
          intent="DARK"
          loading={loading}
          onPress={form.submit}
        />
      </View>
    </View>
  );
}
