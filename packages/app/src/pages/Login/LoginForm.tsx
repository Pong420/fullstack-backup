import React from 'react';
import { useRxAsync, RxAsyncOptions } from 'use-rx-async';
import { Param$Login, login } from '../../service';
import { TextInput } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { ButtonGroup } from '../../components/ButtonGroup';
import { createForm, validators } from '../../utils/form';
import { PromiseOf } from '../../typings';

const { Form, useForm } = createForm<Param$Login>();

const request = (params: Param$Login) =>
  login(params).then(res => res.data.data);

interface Props
  extends Pick<
    RxAsyncOptions<PromiseOf<ReturnType<typeof request>>>,
    'onSuccess' | 'onFailure'
  > {}

export function LoginForm(options: Props) {
  const [form] = useForm();

  const { loading, run } = useRxAsync(request, { defer: true, ...options });

  return (
    <Form
      form={form}
      onFinish={run}
      style={{ padding: 15 }}
      items={[
        {
          name: 'username',
          label: 'Username',
          validators: [validators.required('Please input username')],
          children: (
            <TextInput
              autoFocus
              autoCapitalize="none"
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
    >
      <ButtonGroup
        buttons={[
          { title: 'Login', loading, onPress: form.submit },
          { title: 'Register', ghost: true }
        ]}
      />
    </Form>
  );
}
