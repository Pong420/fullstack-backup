import React from 'react';
import { Button } from 'react-native';
import { Param$Login } from '../../service';
import { TextInput } from '../../components/TextInput';
import { createForm, validators } from '../../utils/form';

const { Form, FormItem, useForm } = createForm<Param$Login>();

export function LoginForm() {
  const [form] = useForm();

  return (
    <Form form={form} style={{ padding: 15 }}>
      <FormItem
        name="username"
        label="Username"
        validators={[validators.required('Please input username')]}
      >
        <TextInput />
      </FormItem>

      <FormItem name="password" label="Password">
        <TextInput />
      </FormItem>

      <Button title="Submit" onPress={form.submit}></Button>
    </Form>
  );
}
