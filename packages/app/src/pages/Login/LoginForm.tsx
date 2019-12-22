import React from 'react';
import { View } from 'react-native';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { Button } from '../../components/Button';
import { Param$Login } from '../../service';

const { Form, useForm } = createForm<Param$Login>();

interface Props {
  loading: boolean;
  onSubmit: (params: Param$Login) => void;
}

export function LoginForm({ loading, onSubmit }: Props) {
  const [form] = useForm();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Form
        form={form}
        onFinish={onSubmit}
        items={[
          {
            name: 'username',
            label: 'Username',
            validators: [validators.required('Please input username')],
            children: (
              <TextInput
                textContentType="username"
                autoCompleteType="username"
              />
            )
          },
          {
            name: 'password',
            label: 'Password',
            validators: [validators.required('Please input password')],
            children: <Password />
          }
        ]}
      />
      <Button title="Login" loading={loading} onPress={form.submit} />
    </View>
  );
}
