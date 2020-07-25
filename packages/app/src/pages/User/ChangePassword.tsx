import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useRxAsync } from 'use-rx-hooks';
import { Param$ModifyPassword } from '@fullstack/typings';
import { Password } from '../../components/Password';
import { Button } from '../../components/Button';
import { toaster } from '../../components/Toast';
import {
  KeyboardAvoidingView,
  ScrollView
} from '../../components/KeyboardAvoidingView';
import { createForm, validators } from '../../utils/form';
import { useAuth } from '../../hooks/useAuth';
import { modifyPassword } from '../../service';

const { Form, FormItem, useForm } = createForm<Param$ModifyPassword>({
  style: { marginBottom: 15 }
});

const onFailure = toaster.apiError.bind(toaster, 'Change Password Failure');

export function ChangePassword({ navigation }: StackScreenProps<{}>) {
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

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Form form={form} onFinish={run}>
          <FormItem
            label="Current Password"
            name="password"
            validators={validators.oldPassword}
          >
            <Password />
          </FormItem>

          <FormItem
            label="New Password"
            name="newPassword"
            deps={['password']}
            validators={validators.newPassword}
          >
            <Password />
          </FormItem>

          <FormItem
            label="Confirm New Password"
            name="confirmNewPassword"
            deps={['newPassword']}
            validators={validators.confirmNewPassword}
          >
            <Password />
          </FormItem>
        </Form>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          intent="DARK"
          title="Confirm"
          loading={loading}
          onPress={form.submit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const contianerPadding = 24;
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: contianerPadding },
  scrollViewContent: { paddingHorizontal: contianerPadding },
  buttonContainer: {
    padding: contianerPadding,
    backgroundColor: '#fff'
  }
});
