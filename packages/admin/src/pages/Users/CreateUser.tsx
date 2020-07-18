import React from 'react';
import { Schema$User } from '@fullstack/typings';
import { createUser } from '@fullstack/common/service';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { ButtonPopover, IconName } from '../../components/ButtonPopover';
import { createUserForm, userValidaors } from '../../components/UserForm';
import { Toaster } from '../../utils/toaster';

export interface OnCreate {
  onCreate: (payload: Schema$User) => void;
}

interface CreateUserProps extends OnCreate {}

const {
  Form,
  Username,
  Password,
  Nickname,
  Email,
  UserRole,
  useForm
} = createUserForm();

const icon: IconName = 'new-person';
const title = 'Create User';
export function CreateUser({ onCreate }: CreateUserProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const response = await createUser(payload);
      onCreate(response.data.data);
      Toaster.success({ message: 'Create user success' });
    } catch (error) {
      Toaster.apiError('Create user failure', error);
      throw error;
    }
  }

  const children = (
    <Form form={form}>
      <Username
        autoFocus
        validators={[
          userValidaors.username.format,
          userValidaors.username.required
        ]}
      />
      <Password
        deps={['username']}
        validators={({ username }) => [
          userValidaors.password.required,
          userValidaors.password.format,
          userValidaors.password.equalToUsername(username)
        ]}
      />
      <Nickname />
      <Email />
      <UserRole />
    </Form>
  );

  return (
    <ButtonPopover
      minimal
      icon={icon}
      content={title}
      onClick={() =>
        openConfirmDialog({
          icon,
          title,
          children,
          onConfirm,
          onClosed: () => form.resetFields()
        })
      }
    />
  );
}
