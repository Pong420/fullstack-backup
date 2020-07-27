import React, { ReactNode, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { StackScreenProps } from '@react-navigation/stack';
import { Param$UpdateUser, Schema$User } from '@fullstack/typings';
import { Button } from '../../../components/Button';
import { toaster } from '../../../components/Toast';
import { PageModal } from '../../../components/PageModal';
import { TextInput } from '../../../components/TextInput';
import { createForm, validators } from '../../../utils/form';
import { useAuth } from '../../../hooks/useAuth';
import { updateUser } from '../../../service';

interface Create {
  title: string;
  prefix: string;
  content: (user: Partial<Schema$User>) => ReactNode;
}

const { Form, FormItem, useForm } = createForm<Param$UpdateUser>();

const request = (...args: Parameters<typeof updateUser>) =>
  updateUser(...args).then(res => res.data.data);

function createModal({ title, content, prefix }: Create) {
  const onFailure = toaster.apiError.bind(toaster, `Update ${prefix} Failure`);

  return function ({ navigation }: StackScreenProps<{}>) {
    const { user, updateProfile } = useAuth();
    const { current: onSuccess } = useRef((payload: Schema$User) => {
      updateProfile(payload);
      navigation.goBack();
      toaster.success({ message: `Update ${prefix} success` });
    });
    const { run, loading } = useRxAsync(request, {
      defer: true,
      onSuccess,
      onFailure
    });
    const [form] = useForm();

    return (
      <PageModal title={title} onClose={navigation.goBack}>
        <Form
          style={styles.content}
          form={form}
          onFinish={changes => user && run({ id: user.user_id, ...changes })}
        >
          {user && content(user)}

          <Button
            intent="DARK"
            title="Confirm"
            loading={loading}
            onPress={form.submit}
          />
        </Form>
      </PageModal>
    );
  };
}

export const NewNickNameModal = createModal({
  prefix: 'nickname',
  title: 'New nickname',
  content: ({ nickname }) => (
    <FormItem
      name="nickname"
      validators={[
        validators.required('Please input new nickname'),
        validators.shouldNotBeEqual(
          nickname,
          'Should not equal to the old nickname'
        )
      ]}
    >
      <TextInput textContentType="nickname" autoCompleteType="name" />
    </FormItem>
  )
});

export const NewEmailModal = createModal({
  prefix: 'email address',
  title: 'New email address',
  content: ({ email }) => (
    <FormItem
      name="email"
      validators={[
        validators.required('Please input new email address'),
        validators.shouldNotBeEqual(
          email,
          'Should not equal to the old email address'
        )
        // TODO:
      ]}
    >
      <TextInput textContentType="emailAddress" autoCompleteType="email" />
    </FormItem>
  )
});

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
