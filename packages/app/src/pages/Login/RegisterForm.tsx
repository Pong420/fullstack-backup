import React from 'react';
import { View } from 'react-native';
import { Param$CreateUser } from '@fullstack/typings';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_MESSAGE,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_MESSAGE,
  USERNAME_REGEX,
  USERNAME_REGEX_MESSAGE,
  PASSWORD_EUQAL_TO_USERNAME,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REGEX_MESSAGE
} from '@fullstack/common/constants';
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
            validators.required('Please input username'),
            validators.minLength(
              USERNAME_MIN_LENGTH,
              USERNAME_MIN_LENGTH_MESSAGE
            ),
            validators.maxLength(
              USERNAME_MAX_LENGTH,
              USERNAME_MAX_LENGTH_MESSAGE
            ),
            validators.regex(USERNAME_REGEX, USERNAME_REGEX_MESSAGE)
          ]}
        >
          <TextInput textContentType="username" autoCompleteType="username" />
        </FormItem>

        <FormItem
          name="password"
          label="Password"
          deps={['username']}
          validators={({ username }) => [
            validators.required('Please input password'),
            validators.minLength(
              PASSWORD_MIN_LENGTH,
              PASSWORD_MIN_LENGTH_MESSAGE
            ),
            validators.maxLength(
              PASSWORD_MAX_LENGTH,
              PASSWORD_MAX_LENGTH_MESSAGE
            ),
            validators.regex(PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE),
            validators.shouldNotBeEqual(username, PASSWORD_EUQAL_TO_USERNAME)
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
