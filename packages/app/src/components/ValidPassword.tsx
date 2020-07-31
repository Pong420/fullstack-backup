import React from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Param$Login } from '@fullstack/typings';
import { useNavigation } from '@react-navigation/native';
import { Password } from './Password';
import { Button } from './Button';
import { toaster } from './Toast';
import { PageModal } from './PageModal';
import { createForm, FormProps, validators } from '@/utils/form';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/service';
import { containerPadding } from '@/styles';

interface Props {
  onSuccess: () => void;
}

export const { Form, FormItem, useForm } = createForm<Param$Login>();

const onFailure = toaster.apiError.bind(toaster, 'Validation Failure');

export function ValidPasswordContent({
  loading,
  form,
  onFinish,
  ...props
}: FormProps<Param$Login> & { loading?: boolean }) {
  const { user } = useAuth();
  const { goBack } = useNavigation();

  return (
    <PageModal title="Enter your password" onClose={goBack}>
      <Form
        {...props}
        form={form}
        style={styles.content}
        onFinish={payload =>
          onFinish && onFinish({ ...payload, username: user!.username })
        }
      >
        <FormItem
          label="Password"
          name="password"
          validators={[validators.password.required]}
        >
          <Password
            returnKeyType={form ? 'send' : undefined}
            onSubmitEditing={form?.submit}
          />
        </FormItem>

        <Button
          intent="DARK"
          title="Confirm"
          loading={loading}
          onPress={form?.submit}
        />
      </Form>
    </PageModal>
  );
}

export function ValidPassword({ onSuccess }: Props) {
  const { run, loading } = useRxAsync(login, {
    defer: true,
    onSuccess,
    onFailure
  });
  const [form] = useForm();

  return <ValidPasswordContent form={form} loading={loading} onFinish={run} />;
}

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
