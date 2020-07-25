import React from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Param$Login } from '@fullstack/typings';
import { Password } from './Password';
import { Button } from './Button';
import { toaster } from './Toast';
import { Modal } from './Modal';
import { createForm } from '../utils/form';
import { useAuth } from '../hooks/useAuth';
import { login } from '../service';

interface Props {
  onSuccess: () => void;
}

const { Form, FormItem, useForm } = createForm<Param$Login>();

const onFailure = toaster.apiError.bind(toaster, 'Validation Failure');

export function ValidPassword({ onSuccess }: Props) {
  const { user } = useAuth();
  const { run, loading } = useRxAsync(login, {
    defer: true,
    onSuccess,
    onFailure
  });
  const [form] = useForm();

  return (
    <Modal title="Enter your password">
      <Form
        form={form}
        style={styles.content}
        onFinish={payload => run({ ...payload, username: user!.username })}
      >
        <FormItem label="Password" name="password">
          <Password />
        </FormItem>

        <Button
          intent="DARK"
          title="Confirm"
          loading={loading}
          onPress={form.submit}
        />
      </Form>
    </Modal>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: containerPadding,
    justifyContent: 'space-between'
  }
});
