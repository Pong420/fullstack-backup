import React from 'react';
import { Button, IconName } from '@blueprintjs/core';
import { Schema$User } from '@fullstack/typings';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { createUserForm, userValidaors } from '../../components/UserForm';
import { Toaster } from '../../utils/toaster';
import { createUser } from '../../service';

export interface OnCreate {
  onCreate: (payload: Schema$User) => void;
}

interface CreateUserProps extends OnCreate {}

const onFailure = Toaster.apiError.bind(Toaster, 'Create user failure');

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
export function CreateUser({ onCreate }: CreateUserProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    const response = await createUser(payload);
    onCreate(response.data.data);
  }

  return (
    <Button
      minimal
      icon={icon}
      onClick={() =>
        openConfirmDialog({
          icon,
          title: 'Create User',
          onFailure,
          onConfirm,
          onClosed: () => form.resetFields(),
          children: (
            <Form form={form}>
              <Username
                validators={[
                  userValidaors.username.format,
                  userValidaors.username.required
                ]}
              />
              <Password
                validators={[
                  userValidaors.password.format,
                  userValidaors.password.required
                ]}
              />
              <Nickname />
              <Email />
              <UserRole />
            </Form>
          )
        })
      }
    />
  );
}
