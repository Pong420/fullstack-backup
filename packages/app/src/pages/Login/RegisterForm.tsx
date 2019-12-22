import React from 'react';
import { View } from 'react-native';
import { createForm, validators } from '../../utils/form';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { Button } from '../../components/Button';
import { Param$CreateUser } from '../../service';

type Fields = Required<Param$CreateUser & { confirmPassword: string }>;

const { Form, useForm } = createForm<Fields>();

interface Props {
  loading: boolean;
  onSubmit: (params: Param$CreateUser) => void;
}

export function RegisterForm({ loading, onSubmit }: Props) {
  const [form] = useForm();

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <Form
        form={form}
        onFinish={onSubmit}
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          nickname: ''
        }}
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
            validators: [validators.password({ required: true })],
            children: <Password />
          },
          {
            name: 'confirmPassword',
            label: 'Confirm Password',
            deps: ['password'],
            validators: ({ password }) => [
              validators.required('Plase input confirm password'),
              validators.shouldBeEqual(
                password,
                'Not the same as above password'
              )
            ],
            children: <Password />
          },
          {
            name: 'email',
            label: 'Email',
            validators: [
              validators.required('Please input an email'),
              validators.isEmail
            ],
            children: (
              <TextInput
                autoCompleteType="email"
                textContentType="emailAddress"
              />
            )
          },
          {
            name: 'nickname',
            label: 'Nickname',

            children: (
              <TextInput autoCompleteType="name" textContentType="nickname" />
            )
          }
        ]}
      />
      <Button title="Register" loading={loading} onPress={form.submit} />
    </View>
  );
}
