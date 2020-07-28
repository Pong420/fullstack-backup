import React, { useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Param$ModifyPassword } from '@fullstack/typings';
import { Header } from '../../components/Header';
import { useFocusNextHandler } from '../../components/TextInput';
import { Password } from '../../components/Password';
import { Button } from '../../components/Button';
import { toaster } from '../../components/Toast';
import { KeyboardAvoidingViewFooter } from '../../components/KeyboardAvoidingViewFooter';
import { createForm, validators } from '../../utils/form';
import { useAuth } from '../../hooks/useAuth';
import { modifyPassword } from '../../service';
import { UserStackScreenProps } from './constants';
import { containerPadding } from '../../styles';

const { Form, FormItem, useForm } = createForm<Param$ModifyPassword>({
  style: { marginBottom: 15 }
});

const onFailure = toaster.apiError.bind(toaster, 'Change Password Failure');

export function ChangePassword({
  navigation
}: UserStackScreenProps<'ChangePassword'>) {
  const [form] = useForm();
  const { logout } = useAuth();
  const { current: onSuccess } = useRef(() => {
    logout({ slient: true });
    navigation.goBack();
    toaster.success({
      title: 'Change Password Success',
      message: 'Please login again'
    });
  });

  const { run, loading } = useRxAsync(modifyPassword, {
    defer: true,
    onSuccess,
    onFailure
  });

  const { refProps, focusNextProps } = useFocusNextHandler<
    Param$ModifyPassword
  >();

  return (
    <Form style={styles.container} form={form} onFinish={run}>
      <Header title="Chnage Password" />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <FormItem
          label="Current Password"
          name="password"
          validators={validators.oldPassword}
        >
          <Password {...focusNextProps('newPassword')} />
        </FormItem>

        <FormItem
          label="New Password"
          name="newPassword"
          deps={['password']}
          validators={validators.newPassword}
        >
          <Password
            ref={refProps('newPassword')}
            {...focusNextProps('confirmNewPassword')}
          />
        </FormItem>

        <FormItem
          label="Confirm New Password"
          name="confirmNewPassword"
          deps={['newPassword']}
          validators={validators.confirmNewPassword}
        >
          <Password ref={refProps('confirmNewPassword')} />
        </FormItem>
      </ScrollView>

      <KeyboardAvoidingViewFooter style={styles.buttonContainer}>
        <Button
          intent="DARK"
          title="Confirm"
          loading={loading}
          onPress={form.submit}
        />
      </KeyboardAvoidingViewFooter>
    </Form>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: containerPadding },
  scrollViewContent: { paddingHorizontal: containerPadding },
  buttonContainer: {
    padding: containerPadding,
    backgroundColor: '#fff'
  }
});
